
type ToastType = 'success' | 'danger' | 'info' | 'warning';
interface Dado {
    tipo: ToastType;
    title: string;
    message: string;
    duration?: number;
  }

 const dados: Dado[] = [
    {
      tipo: 'warning',
      title: "VALOR",
      message: "O campo VALOR deve ser preenchido, o valor deve ser diferente de zero",
      duration: 3000
    },
    {
      tipo: 'warning',
      title: "SITUAÇÃO DO PAGAMENTO",
      message: "A condição de pagamento deve ser informada!",
      duration: 3000
    },
    {
      tipo: 'warning',
      title: "VALOR PARCIAL",
      message: "O campo VALOR PARCIAL deve ser preenchido, o valor deve ser diferente de zero",
      duration: 3000
    },
    {
      tipo: 'warning',
      title: "Parcela",
      message: "A quantidade de parcelas deve ser informada!",
      duration: 2000
    },
    {
      tipo: 'success',
      title: "Salvo",
      message: "A anotação foi salva com sucesso",
      duration: 2000
    }
  ]

  export default dados;