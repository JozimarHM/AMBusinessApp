import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, TextInput, FlatList, ToastAndroid } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useProductDatabase, ProductDatabase } from '@/database/productModel';
import { mask } from 'react-native-mask-text';
import { useNavigation } from 'expo-router';

export default function RegisterScreen() {
    
    const [facing, setFacing] = useState<'front' | 'back'>('back'); // Seleciona camera traseira ou frontal para ler o código de Barras 
    const [scannedCode, setScannedCode] = useState<string | null>(null); // Código de Barras a ser salvo no Database products
    const [name, setName] = useState<string>('');  // Nome do Produto a ser salvo no Database products
    const [price, setPrice] = useState<string>('');  // Preço do Produto a ser salvo no Database products
    const [quantity, setQuantity] = useState<string>('');  // Quantidade do Produto a ser salvo no Database products
    const [showCamera, setShowCamera] = useState(true); // Responsável por Ocultar ou Mostrar camera
    const [products, setProducts] = useState<ProductDatabase[]>([]); // Coleção dos Produtos salvos no banco
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null); // Id do produto selecionado na Lista
    const [permission, requestPermission] = useCameraPermissions(); // Estado da Permissão para acesso à camera
    const { createProduct, removeProduct, getAllProducts, getBarcodeProducts, getProductById } = useProductDatabase();

    // Hook para requisitar permissão de uso da camera se não houver permissão concedida anteriormente.
    useEffect(() => {
        if (permission === null) {
            requestPermission();
        }
    }, [permission, requestPermission]);
    // Cada vez que o estado da camera muda um nova requisição é feita ao Database products
    // para obter todos os produtos cadastrados
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const productList = await getAllProducts();
                setProducts(productList);
            } catch (error) {
                console.error('Função para recuperar produtos',error);
            }
        };

        fetchProducts();
    }, [showCamera]);
    // Se permissão é nulo ,estão mostro uma mensagem indicando que estou carregando as permissões
    if (permission === null) {
        return <View style={styles.container}><Text>Carregando permissões...</Text></View>;
    }
    // Se permissão for falsa estão mostro uma mensagem indicando que precisamos da permissão do usuário
    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Precisamos da sua permissão para mostrar a câmera</Text>
                <Button onPress={requestPermission} title="Conceder permissão" />
            </View>
        );
    }
    // Função chamada pela camera quando um código de barras é lido.
    const handleBarcodeScanned = async (result: { type: string; data: string }) => {
        setShowCamera(false)
        const barcode = await getBarcodeProducts(result.data);
        if (barcode.length > 0) {
  
                    ToastAndroid.
                        showWithGravity(
                            'Código de Barras já está cadastrado',
                            3000,
                            ToastAndroid.CENTER
                        )
                    setShowCamera(true)
        } else {
            setScannedCode(result.data);
            setShowCamera(false); // Ocultar a câmera após a digitalização
        }

    };
    // função responsável por mudar o estado da variável que controla qual camera será usada(fronta ou traseira)
    const toggleCameraFacing = () => {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    };
    // função chamada quando pressiono o botão para salvar os dados no Database products
    const handleSaveProduct = async () => {
        if (scannedCode && name && price && quantity) {
            const product: Omit<ProductDatabase, 'id'> = {
                barcode: scannedCode,
                name: name,
                price: price,
                quantity: parseInt(quantity, 10),
            };

            try {
                await createProduct(product);
                ToastAndroid.show('Produto salvo com sucesso!', 2000);
                resetForm();
                // Atualizar a lista de produtos
                const updatedProducts = await getAllProducts();
                setProducts(updatedProducts);
            } catch (error) {
                console.error(error);
                ToastAndroid.show('Falha ao salvar o produto.', 2000);
            }
        } else {
            alert('Por favor, insira todos os detalhes do produto.');
        }
    };
    // Função chamada ao pressionar o botão deletar, 
    // Para isso devemos primeiro selecionar um item na lista
    const handleDeleteProduct = async () => {
        if (selectedProductId !== null) {
            try {
                await removeProduct(selectedProductId);
                ToastAndroid.showWithGravity('Produto excluído com sucesso!', 2000, ToastAndroid.CENTER);
                resetForm();
                // Refresh product list
                const updatedProducts = await getAllProducts();
                setProducts(updatedProducts);
            } catch (error) {
                console.error(error);
                ToastAndroid.showWithGravity('Falha ao excluir o produto.', 2000, ToastAndroid.CENTER);
            }
        } else {
            ToastAndroid.showWithGravity('Nenhum produto selecionado para exclusão.', 2000, ToastAndroid.CENTER);
        }
    };
    // quando quero parar o processo de cadastramento esta função é chamada.
    const resetForm = () => {
        setScannedCode(null);
        setPrice('');
        setQuantity('');
        setShowCamera(true); // Mostre a câmera novamente se necessário
    };
    // Função a ser chamada no renderizador da FlatList
    // montando o Layout individual dos Itens Salvos 
    const renderProductItem = ({ item }: { item: ProductDatabase }) => (
        <TouchableOpacity
            style={[
                styles.productItem,
                { backgroundColor: item.id === selectedProductId ? '#e0e0e0' : '#fff' },
            ]}
            onLongPress={() => { setShowCamera(false) }}
            onPress={() => setSelectedProductId(item.id)}
        >
            <Text style={styles.productText}>Código de barras: {item.barcode}</Text>
            <Text style={styles.productText}>Nome: {item.name}</Text>
            <Text style={styles.productText}>Preço: {mask(item.price, '', 'currency', {
                prefix: 'R$ ',
                decimalSeparator: ',',
                groupSeparator: '.',
                precision: 2
            })
            }</Text>
            <Text style={styles.productText}>Quantidade: {item.quantity}</Text>
        </TouchableOpacity>
    );
    // Renderização da Tela de Cadastramento de Produtos
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={() => setShowCamera(!showCamera)}>
                <Text style={styles.text}> {showCamera ? 'Fechar Camera' : 'Abrir Camera'}</Text>
            </TouchableOpacity>
            {showCamera ? (
                <CameraView
                    style={styles.camera}
                    facing={facing}
                    barcodeScannerSettings={{
                        barcodeTypes:
                            ['aztec', 'ean13', 'ean8', 'qr', 'pdf417', 'upc_e', 'datamatrix', 'code39', 'code93', 'itf14', 'codabar', 'code128', 'upc_a'],
                    }}
                    onBarcodeScanned={handleBarcodeScanned}
                />
            ) : (
                <View style={styles.resultContainer}>
                    <Text style={styles.text}>Scanned Code: {scannedCode}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nome"
                        keyboardType='default'
                        value={name}
                        onChangeText={setName}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Preço"
                        keyboardType="numeric"
                        value={price}
                        onChangeText={setPrice}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Quantidade"
                        keyboardType="numeric"
                        value={quantity}
                        onChangeText={setQuantity}
                    />
                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.button} onPress={handleSaveProduct}>
                            <Text style={styles.text}>Salvar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={handleDeleteProduct}>
                            <Text style={styles.text}>Deletar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={resetForm}>
                            <Text style={styles.text}>Novo Produto</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={resetForm}>
                            <Text style={styles.text}>Atualizar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
            {showCamera && (
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
                        <Text style={styles.text}>Virar câmera</Text>
                    </TouchableOpacity>
                </View>
            )}
            <View style={styles.productListContainer}>
                <Text style={styles.listTitle}>Produtos Salvos:</Text>
                <FlatList
                    data={products}
                    renderItem={renderProductItem}
                    keyExtractor={item => item.id.toString()}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    camera: {
        width: '80%',
        height: '50%',
    },
    buttonContainer: {
        flexDirection: 'row',
        margin: 20,
    },
    button: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderRadius: 10,
        padding: 10,
        margin: 5,
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    resultContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        padding: 10,
        width: '80%',
        marginVertical: 5,
    },
    buttonRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        width: '80%',
    },
    productListContainer: {
        flex: 1,
        width: '100%',
        padding: 20,
    },
    productItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
    },
    productText: {
        fontSize: 16,
    },
    listTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});
