
async function consultarCEP(cliente) {
  const apiUrl = `https://viacep.com.br/ws/${cliente.cep}/json/`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    if (data.erro) {
      return false;
    } else {
      cliente.rua= data.logradouro;
      cliente.bairro= data.bairro;
      cliente.cidade= data.localidade;
      cliente.estado= data.uf;
      return true;
    }
  } catch (error) {
    return false;
  }
}

module.exports = consultarCEP;