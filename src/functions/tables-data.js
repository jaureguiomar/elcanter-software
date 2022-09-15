const axios = require("axios");
const querystring = require("querystring");

export async function retrieveTablesData(basePath) {
  const data = {
    barra: [23, 24, 25],
    cocina: [1, 2, 3, 4, 5, 6],
    cuartito: [18, 19, 20, 21],
    patio: {
        patio1: [7, 8, 9],
        patio2: [10, 22]
    },
    presidencial: [11, 12, 13, 14, 26, 27],
    redonda: [15, 16, 17]
  };

  /////////////////////
  // Get Ventas Data //
  let barra_data = [];
  for(let i = 0; i < data.barra.length; i++) {
    const curr_id = data.barra[i];
    barra_data.push(await retrieveMesaData(basePath, curr_id));
  }

  let cocina_data = [];
  for(let i = 0; i < data.cocina.length; i++) {
    const curr_id = data.cocina[i];
    cocina_data.push(await retrieveMesaData(basePath, curr_id));
  }

  let cuartito_data = [];
  for(let i = 0; i < data.cuartito.length; i++) {
    const curr_id = data.cuartito[i];
    cuartito_data.push(await retrieveMesaData(basePath, curr_id));
  }

  let patio1_data = [];
  for(let i = 0; i < data.patio.patio1.length; i++) {
    const curr_id = data.patio.patio1[i];
    patio1_data.push(await retrieveMesaData(basePath, curr_id));
  }

  let patio2_data = [];
  for(let i = 0; i < data.patio.patio2.length; i++) {
    const curr_id = data.patio.patio2[i];
    patio2_data.push(await retrieveMesaData(basePath, curr_id));
  }

  let presidencial_data = [];
  for(let i = 0; i < data.presidencial.length; i++) {
    const curr_id = data.presidencial[i];
    presidencial_data.push(await retrieveMesaData(basePath, curr_id));
  }

  let redonda_data = [];
  for(let i = 0; i < data.redonda.length; i++) {
    const curr_id = data.redonda[i];
    redonda_data.push(await retrieveMesaData(basePath, curr_id));
  }

  return {
    barra: barra_data,
    cocina: cocina_data,
    cuartito: cuartito_data,
    patio1: patio1_data,
    patio2: patio2_data,
    presidencial: presidencial_data,
    redonda: redonda_data
  };
}

async function retrieveMesaData(basePath, id_mesa) {
  let response = await axios.post(`${basePath}/Ventas/get_where`, querystring.stringify({
    status: 1,
    idmesa: id_mesa
  }), {
    responseType: "text",
    headers: {
      "X-Requested-With": "XMLHttpRequest",
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
    }
  });
  if(response) {
    const data = response.data;
    if(data)
      return data;
    else
      return {};
  } else {
    return {};
  }
}
