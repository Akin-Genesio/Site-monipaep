import * as yup from "yup";

yup.addMethod<yup.StringSchema>(
  yup.string,
  'cpf',
  function (message = 'CPF inválido') {
    return this.test('cpf', message, function(value: string | undefined) {
      let sum = 0
      let rest = 0   
      const strCPF = value?.split(/[^\d+]/).join('')

      if (strCPF?.length !== 11 || !Array.from(strCPF).filter(e => e !== strCPF[0]).length) {
        return false
      }
    
      for (let i=1; i<=9; i++) {
        sum += parseInt(strCPF.substring(i - 1, i)) * (11 - i)
      }
      rest = (sum * 10) % 11

      if ((rest == 10) || (rest == 11)) {
        rest = 0
      }

      if (rest != parseInt(strCPF.substring(9, 10))) {
        return false;
      }
      sum = 0;

      for (let i = 1; i <= 10; i++) {
        sum += parseInt(strCPF.substring(i - 1, i)) * (12 - i)
      }
      rest = (sum * 10) % 11

      if ((rest == 10) || (rest == 11)) {
        rest = 0
      }

      if (rest != parseInt(strCPF.substring(10, 11))) {
        return false
      }

      return true;
    })
  },
);