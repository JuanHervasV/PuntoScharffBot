 const axios = require ('axios');
 const base64url = require ('base64-url');
 const urlencode = require ('urlencode');
 const btoa = require('btoa');
 const functions = require('firebase-functions');
 const {WebhookClient, Image} = require('dialogflow-fulfillment');
 const {Card, Suggestion, Text, Payload} = require('dialogflow-fulfillment');
 var twilio = require('twilio');

 process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

 exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
 const agent = new WebhookClient({ request, response });
 console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
 console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

 //  function welcome(agent) {
 //   agent.add(`Welcome to my agent!`);
 // }
 
 // function fallback(agent) {
 //  agent.add(`I didn't understand`);
 //  agent.add(`I'm sorry, can you try again?`);
 // }
 var accountSid = 'AC97871545718f307a489963183b3c1d7c';
 var authToken = 'f513f9521349e272bf5763b0de12b5f9';


 function twilioHandler(agent){
 var client = new twilio(accountSid, authToken);
 return client.messages
   .create({
     mediaUrl: ['https://i.imgur.com/koHZvZV.jpg'],
     from: 'whatsapp:+14155238886',
     body: `Sireno-man`,
     to: 'whatsapp:+51944414434'
   })
  .then(message => 
        console.log(message.sid),
       agent.add(`Yey.`));
 }
    
    function twilio2Handler(agent){
      exports.handler = (event, context, callback) => {
  console.log(event);
};
  const { body } = req;
  const mediaDownloads = [];

  for (let resourceId = 0; resourceId < body.NumMedia; resourceId++) {
    const mediaUrl = body[`MediaUrl${resourceId}`];
    agent.add(mediaUrl);
    agent.add(`www`);
  }
    }
     
    
  function rimasHandler(agent){
  const word = agent.parameters.word;
    agent.add(`Aqui tienes alguas palabras que riman con ${word}: `);
  return axios.get(`https://api.datamuse.com/words?rel_rhy=${word}`).then((result)=>{
      result.data.map(wordObj => {
      	agent.add(wordObj.word);
      });
    });
  }
 function parametrosHandler(agent) {
  const codCliente=agent.parameters.codCliente;
  const guia_det_cta=agent.parameters.guia_det_cta;
  return axios.post(`http://200.37.50.60/Servicios/ws4/wsMthn/api/Guia/Consulta`,
        {     codCliente: `${codCliente}`,
              guia_det_cta: `${guia_det_cta}`
        }).then((response) =>{
    console.log(response.data);
    console.log(response.status);
    console.log(response.statusText);
    console.log(response.headers);
    console.log(response.config);
    
    agent.add(`El código POD es: `+JSON.stringify((response.data).CodigoPOD)+`, su número de guia es: `+JSON.stringify((response.data).Descripcion));
            }).catch(e => {	
            console.log(e);
    		agent.add(e);
    });
}
  function enviarimagenHandler(agent) {
  exports.handler = (event, context, callback) => {
  console.log(event);
};
    //const contextp= JSON.stringify(agent.contexts[0].parameters.facebook_sender_id);
	const imageUrl = agent.request_.body.originalDetectIntentRequest.payload.data.message.attachments[0].payload.url;
    const encode64imageUrl = base64url.encode(imageUrl);
    const imagenEncode= encodeURI(imageUrl);
    const imagenEncode2= urlencode(imageUrl);
    agent.add(`Imagen guardada: `+imageUrl+` / `);
    agent.add(`Imagen en encode64: `+encode64imageUrl);
    agent.add(`Imagen en encodeURI: `+imagenEncode);
    agent.add(`Imagen en encode: `+imagenEncode2);
    }
    
 // const CodPto= agent.parameters.PtoScharff;
  function registrarenvioHandler(agent){
  const CodPto = agent.parameters.PtoScharff;
  return axios.get(`http://200.37.50.60/BotSpencer/api/RegistrarEnvio?CodigoAgente=${CodPto}`)
  .then((response)=>{
  console.log(response.data);
  //agent.add(`Su nombre es: `+JSON.stringify((response.data)[0].Nombre)+`. Ahora ingrese su guía.`);
  agent.add(`Bienvenido `+JSON.stringify((response.data).Nombre)+` 🏛️. ¿Cuál es su número de guia?`);
  }).catch(e => {
    console.log(e);
    agent.end(`Punto Scharff no encontrado.`);
   //response.close(`Punto Scharff no encontrado.`);
   	agent.setFollowupEvent(`FINISH_EVENT`);
 	});
  }
 
  function registrarenvioguiaHandler(agent){
    const GuiaNro = Number(agent.parameters.GuiaNro);
    const GuiaPre = agent.parameters.GuiaPre;
  // const GuiaTot = ``+GuiaPre+``+GuiaNro;
    const CodigoAgente=JSON.stringify(agent.contexts[3].parameters.PtoScharff);
    const x = CodigoAgente.replace('"','');
    const y = x.replace('"','');
  // const ab = agent.getContext(RegistrarEnvio-followup).PtoScharff;
  //const ab = JSON.stringify(agent.contexts[3].parameters.PtoScharff);    
    
  //return axios.get(`http://200.37.50.60/BotSpencer/api/Guia?pr=${GuiaPre}&nu=${GuiaNro}`)
  //return axios.get(`http://200.37.50.60/BotSpencer/api/RGuia/${GuiaTot}`)
    return axios.get(`http://200.37.50.60/BotSpencer/api/RegistrarEnvio?CodigoAgente=${y}&Prefijo=${GuiaPre}&NroGuia=${GuiaNro}`)
  // api/Guia?CodigoAgente=${y}&Prefijo=${GuiaPre}&NroGuia=${GuiaNro}`)
  // return axios.get(`http://200.37.50.60/BotSpencer/api/Guia?CodigoAgente=SC156&Prefijo=SC&NroGuia=1560`)
    .then((response)=>{
    console.log(response.data);
     agent.add(`Guia confirmada. Por último, envíe la foto de su guia. `);
     }).catch(e => {
        console.log(e);
    	agent.add(`Guia no encontrada. Intente nuevamente.`);
 		});
   //&& GuiaNro<=(Number(JSON.stringify(response.data).NroFin))
   // if (Number((response.data).NroInicio)<GuiaNro)
   //     {
   //   agent.add(`Correcto, por último envíe la foto de la guia.`);
    //    }
    //  else{
    //    agent.add(`Guia incorrecta: `+JSON.stringify((response.data).NroInicio));
 //         }
 //	}).catch(e => {
   //         console.log(e);
    //		agent.add(`Punto Scharff no encontrado`);
  }
  function registrarenvioGuiafotoHandler(agent){
  exports.handler = (event, context, callback) => {
  console.log(event);
};
  const imageUrl = agent.request_.body.originalDetectIntentRequest.payload.data.message.attachments[0].payload.url;
  // agent.add(`Imagen guardada: `+imageUrl);
  const GuiaPreF = JSON.stringify(agent.contexts[4].parameters.GuiaPre);
  const a = GuiaPreF.replace('"','');
  const b = a.replace('"','');
  const GuiaNroF = JSON.stringify(agent.contexts[4].parameters.GuiaNro);
  const c = GuiaNroF.replace('"','');
  const d = c.replace('"','');
  const GuiaComple = b+d; 
  const Guia=GuiaComple;
  const LinkImagen=imageUrl;
  const LinkFacebook=``;
  const CodigoAgente=JSON.stringify(agent.contexts[4].parameters.PtoScharff);
  const x = CodigoAgente.replace('"','');
  const y = x.replace('"','');
  const g=JSON.stringify(agent.contexts[0].parameters.facebook_sender_id);
  //const g = "";
  const f = g.replace('"','');
  const facebookid = f.replace('"','');

  return axios.post(`http://200.37.50.60/BotSpencer/api/RegistrarEnvio`,
        {     NroGuia: `${Guia}`,
              LinkImagen: `${LinkImagen}`,
         	  Facebook_Sender_Id: `${facebookid}`,
        	  CodigoAgente: `${y}`
        }).then((response) =>{
    console.log(response.data);
    agent.add(`Envio registrado exitosamente.`);
            }).catch(e => {	
            console.log(e);
    		agent.add(`Ocurrió un error.`);
    });
}
  function entregarclienteptoscharffHandler(agent){
  	const CodPto = agent.parameters.PtoScharff;
 return axios.get(`http://200.37.50.60/BotSpencer/api/Guia?dato=${CodPto}`)
   .then((response)=>{
    console.log(response.data);
 // agent.add(`Su nombre es: `+JSON.stringify((response.data)[0].Nombre)+`. Ahora ingrese su guía.`);
	 agent.add(`Bienvenido `+JSON.stringify((response.data).Nombre)+` 🏛️. Seleccione su pendiente a entregar:`);
	}).catch(e => {
        console.log(e);
    		agent.end(`Punto Scharff no encontrado, reintente una vez más.`);
 		});
  }
  //function nombrefacebookHandler(agent){
   // let url = `https://graph.facebook.com/v3.2/100004994220957?access_token=EAAe5Twreh0EBAG1w00GAGp6Cri73JFvbzrCS4IsL3ZAIoAZBpWVSu4eZCZCFUrZA9tGnZCgYGEHMM2ey3U8ngRZC9HJbLnHgm7ciD84BXR7DThaqLdXmagTm59sHMBazVYZAOveZCp5ZCfBIYMS52rJfWymyYF1GZAE3b0CeWJjMdX7gAZDZD`;
   // const response = await.axios.get(url);
   // let user = response.data;
   // var responseText = `Hi there ${user.first_name}, How can i help you today?`;
  //  const CodigoAgente=JSON.stringify(agent.contexts[4].parameters.PtoScharff);
  //  return axios.get(`https://graph.facebook.com/v2.6/USER_ID?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=EAAe5Twreh0EBAG1w00GAGp6Cri73JFvbzrCS4IsL3ZAIoAZBpWVSu4eZCZCFUrZA9tGnZCgYGEHMM2ey3U8ngRZC9HJbLnHgm7ciD84BXR7DThaqLdXmagTm59sHMBazVYZAOveZCp5ZCfBIYMS52rJfWymyYF1GZAE3b0CeWJjMdX7gAZDZD`)
 //  .then((response)=>{
 //   console.log(response.data);
 //     agent.add(`Su nombre es: `+JSON.stringify(response.data));
 // agent.add(`Su nombre es: `+JSON.stringify((response.data)[0].Nombre)+`. Ahora ingrese su guía.`);
	 //agent.add(`Su nombre es: `+JSON.stringify((response.data).Nombre)+`. Ahora envíe su número de guia.`);
	//}).catch(e => {
   //     console.log(e);
  //    agent.add(`Su nombre es: `+JSON.stringify(response.data));
    	//	agent.end(`Punto Scharff no encontrado, reintente una vez más.`);
   			
 //		});
 // }
  function cotizarenvioHandler(agent){
  const CodPto = agent.parameters.PtoScharff;
 return axios.get(`http://200.37.50.60/BotSpencer/api/RegistrarEnvio?CodigoAgente=${CodPto}`)
   .then((response)=>{
    console.log(response.data);
 // agent.add(`Su nombre es: `+JSON.stringify((response.data)[0].Nombre)+`. Ahora ingrese su guía.`);
	 agent.add(`Bienvenido `+JSON.stringify((response.data).Nombre)+` 🏛️. ¿A qué distrito desea enviar?`);
	}).catch(e => {
        console.log(e);
    		agent.end(`Punto Scharff no encontrado.`);
  //	agent.setContext({'name':'cotizarenvio', "lifespanCount":-1});
  //		agent.setContext({'name':'cotizarenvio-followup',"lifespanCount":-1});
  //			agent.setContext({'name':'cotizar_envio_dialog_context',"lifespanCount":-1});
  // agent.clearContext('cotizarenvio');
  // agent.clearContext('cotizarenvio-followup');
  // agent.clearContext('cotizar_envio_dialog_context');
 });
}  

  function cotizarenviodistritoHandler(agent){
  const distrito=agent.parameters.Distrito;
  agent.add(`Indique el número de destino al que desee enviar ✈️: `);
  return axios.get(`http://200.37.50.60/BotSpencer/api/CotizarEnvio?Destino=${distrito}`).then((result)=>{
  result.data.map(wordObj => {
  agent.add(``+wordObj.UbigeoDes);
      });
    });
  }  
    function cotizarenviofinalHandler(agent){
    const opcio= Number(agent.parameters.Opcion);
    const valor = agent.parameters.Valor;
    const peso = agent.parameters.Peso;
    const segur = agent.parameters.Seguro;
    var seguro;
      if (segur==`Si`){
      seguro=1;
    }
      else if(segur==`si`){
        seguro=1;
              }
      else{
      seguro=0;
      }
    const agen= JSON.stringify(agent.contexts[0].parameters.PtoScharff);
    const agente = agen.replace('"','');
  	const agentef = agente.replace('"','');
    const distri = JSON.stringify(agent.contexts[0].parameters.Distrito);
    const distrit = distri.replace('"','');
  	const distrito = distrit.replace('"','');
    
    return axios.get(`http://200.37.50.60/BotSpencer/api/CotizarEnvio?Destino=${distrito}`)
    .then((response)=>{
    //agent.add(``+JSON.stringify((response.data)[0].ubigeo)+``+distrito);
    //agent.add(``+JSON.stringify((response.data)[1].ubigeo)+``+distrito);
    //agent.add(``+JSON.stringify((response.data)[2].ubigeo)+``+distrito);
    const opcion = (opcio-1);
    //agent.add(``+JSON.stringify((response.data)[opcion].ubigeo)+``+distrito);
    //agent.add(``+JSON.stringify((response.data)[opcio-1].ubigeo)+``+distrito);
    const op= JSON.stringify((response.data)[opcion].ubigeo);
    const r = op.replace('"','');
    const w = r.replace('"','');
    
  	return axios.get(`http://200.37.50.60/BotSpencer/api/CotizarEnvio?Ubigeo=${w}&Peso=${peso}&Valor=${valor}&Seguro=${seguro}&agente=${agentef}`)
//=${w}&Peso=${peso}&Valor=${valor}&Seguro=${seguro}&agente=${agentef}`)
//api/CotizarEnvio?Ubigeo=${w}&Peso=${peso}&Valor=${valor}&Seguro=${seguro}&agente=${agentef}`)
   		.then((response)=>{
      const precio = Number(JSON.stringify((response.data).Flete)) + Number(JSON.stringify((response.data).Seguro));
 	 	agent.end(`El costo de envío es de S/.${precio} y llegaría en `+JSON.stringify((response.data).DiasEta)+` día(s) 😉`);
	
        }).catch(e => {
        console.log(e);
    		agent.add(`Error al cotizar.`);
 		});
      
	}).catch(e => {
      console.log(e);
  		agent.add(`Error al seleccionar su opción de envío.`);
 });
  }
    
    function horaamericaHandler(agent){
    const ciudad= agent.parameters.Ciudad;
    const todo=axios.get(`http://worldtimeapi.org/api/timezone/America/${ciudad}`)
   		.then((response)=>{
          const a=JSON.stringify((response.data).datetime);
          const b=a.replace('"','');
    	  const c= b.replace('"','');
 	 	agent.add(`La hora es:`+c+`.`);	
        }).catch(e => {
        console.log(e);
    		agent.end(`Error.`);
 		});
      return todo;
    }
	      
    function entregarpendienteHandler(agent){
    const puntoscharff = agent.parameters.PuntoScharff;
    return axios.get(`http://200.37.50.60/BotSpencer/api/RegistrarEnvio?CodigoAgente=${puntoscharff}`)
   .then((response)=>{
    console.log(response.data);
 // agent.add(`Su nombre es: `+JSON.stringify((response.data)[0].Nombre)+`. Ahora ingrese su guía.`);
	 agent.add(`Bienvenido `+JSON.stringify((response.data).Nombre)+` 🏛️. ¿Qué pendiente desea entregar?`);
      return axios.get(`http://200.37.50.60/BotSpencer/api/Entregar?CodigoAgente=${puntoscharff}`)
      .then((result)=>{
      result.data.map(wordObj => {
        agent.add(``+wordObj.NroPaqueteOpt);        
      });
    });
	}).catch(e => {
        console.log(e);
    		agent.end(`Punto Scharff no encontrado.`);
      });
  }
    
  function entregarpendientesHandler(agent){
      const pendiente= Number(agent.parameters.Pendientes);
      const pendientes= (pendiente-1);
      const dni = agent.parameters.DNI;
      const puntoschar= JSON.stringify(agent.contexts[1].parameters.PuntoScharff);
  	  const puntoscharf = puntoschar.replace('"','');
      const puntoscharff = puntoscharf.replace('"','');
   	  return axios.get(`http://200.37.50.60/BotSpencer/api/Entregar?CodigoAgente=${puntoscharff}`)
        .then((response)=>{
        console.log(response.data);
        const nropaque=JSON.stringify((response.data)[pendientes].NroPaquete);
        const nropaquet = nropaque.replace('"','');
        const nropaquete = nropaquet.replace('"','');
      //  agent.add(``+nropaquete);
      //  agent.add(``+dni);
           //   agent.add(`Indique el pendiente que desee entregar: `); 
         return axios.get(`http://200.37.50.60/BotSpencer/api/Entregar?NroPaquete=${nropaquete}&DniCliente=${dni}&CodigoAgente=${puntoscharff}`)
         .then((response)=>{
   	//	 console.log(response.data);
 //agent.add(`Su nombre es: `+JSON.stringify((response.data)[0].Nombre)+`. Ahora ingrese su guía.`);
   		agent.add(`Correcto, ¿desea entregar el pendiente?`);
           //BOTONES PENDIENTES
           agent.add(new Suggestion(`Si`));
           agent.add(new Suggestion(`No`));
      	});
      }).catch(e => {
        console.log(e);
    		agent.end(`Error al ingresar el DNI.`);
      });
  }
   function entregarconfHandler(agent){
   //const opcio=agent.parameters.Opcion;
   
   }
   function entregarfinalfotoHandler(agent){
   exports.handler = (event, context, callback) => {
   console.log(event);
}; 
   const pntoschar=JSON.stringify(agent.contexts[0].parameters.PuntoScharff);
   const puntoscharf = pntoschar.replace('"','');
   const puntoscharff = puntoscharf.replace('"','');
   const d=JSON.stringify(agent.contexts[0].parameters.DNI);
   const dn = d.replace('"','');
   const dni = dn.replace('"','');
   const pendien = JSON.stringify(agent.contexts[0].parameters.Pendientes);
   const pendient= pendien.replace('"','');
   const pendientess= pendient.replace('"','');
   const pendiente= Number(pendientess);
   const pendientes = (pendiente-1);
   //lalala
   return axios.get(`http://200.37.50.60/BotSpencer/api/Entregar?CodigoAgente=${puntoscharff}`)
        .then((response)=>{
        console.log(response.data);
        const nropaque=JSON.stringify((response.data)[pendientes].NroPaquete);
        const nropaquet = nropaque.replace('"','');
        const nropaquete = nropaquet.replace('"','');
        //agent.add(``+nropaquete);   

   const imageUrl = agent.request_.body.originalDetectIntentRequest.payload.data.message.attachments[0].payload.url;
      return axios.post(`http://200.37.50.60/BotSpencer/api/Entregar`,
        {     CodigoAgente: `${puntoscharff}`,
              NroPaquete: `${nropaquete}`,
         	  DniCliente: `${dni}`,
        	  FotoPOD: `${imageUrl}`
        }).then((response) =>{
    console.log(response.data);
    agent.add(`Pendiente entregado exitosamente.`);
            }).catch(e => {	
            console.log(e);
    		agent.add(`Error.`);  
    });   
     });      
    }
  function qrfotoHandler(agent){
  exports.handler = (event, context, callback) => {
  console.log(event);
    
};
	const imageUrl = agent.request_.body.originalDetectIntentRequest.payload.data.message.attachments[0].payload.url;
    const imagenEncode2= urlencode(imageUrl);
    //agent.add(`Imagen en encode: `+imagenEncode2);
    return axios.get(`http://api.qrserver.com/v1/read-qr-code/?fileurl=${imagenEncode2}`)
        .then((response)=>{
        console.log(response.data);
    	console.log(response.status);
    	console.log(response.statusText);
    	console.log(response.headers);
    	console.log(response.config);
      	const q1=JSON.stringify((response.data)[0].symbol[0].data);
      	const q2=q1.replace('"','');
        const qr=q2.replace('"','');
        agent.add(`Su código QR dice :`+qr);
      });
  }
 
  function qcrearf(agent){
  exports.handler = (event, context, callback) => {
  console.log(event);
};
	const imageUrl = agent.request_.body.originalDetectIntentRequest.payload.data.message.attachments[0].payload.url;
    const imagenEncode2= urlencode(imageUrl);
    //agent.add(`Imagen en encode: `+imagenEncode2);
    return axios.get(`http://api.qrserver.com/v1/create-qr-code/?data=${imagenEncode2}&size=100x100`)
        .then((response)=>{
        console.log(response.data);
      	//const q1=JSON.stringify((response.data)[0].symbol[0].data);
      	//const q2=q1.replace('"','');
        //const qr=q2.replace('"','');
        //agent.add(qr);
      agent.add(response.data);
      agent.add(new Image(`https://www.holascharff.com/images/scharff_logo@2x.png`));
      let card=new Card(`Scharff`);
      card.setTitle('Scharff');
      card.setText('Página web Scharff');
      card.setImage('https://www.holascharff.com/images/scharff_logo@2x.png');
      card.setButton({ text: 'Hazme click', url: 'https://www.holascharff.com/' });
      agent.add(card);
      let suggestion = new Suggestion('reply to be overwritten', 'JJ','JAJ','DD');
      suggestion.setReply('H', 'O', 'L', 'A');
      suggestion.setReply('H');
      agent.add(`Hey `+JSON.stringify(suggestion));
      let text = new Text(`dsd`);
      text.setSsml('<speak>This is <say-as interpret-as="characters">SSML</say-as>.</speak>');
      agent.add(text);
      });
  }
    function mandarsmsHandler(agent){
    const numero=agent.parameters.Numero;
    const texto=agent.parameters.Texto;
    var session_url = 'http://89.api.infobip.com/sms/2/text/single';
	var username = 'BBVAENVIOTARJETAS';
	var password = '456bbva';
	var basicAuth = 'Basic QkJWQUVOVklPVEFSSkVUQVM6NDU2YmJ2YQ==';//+btoa(username+':'+password)
      //agent.add(basicAuth);
	return axios.post(session_url, 
           {"to":`${numero}`,
  			"text":`${texto}`}, 
           { auth: 
            {"username": `BBVAENVIOTARJETAS`,  //This could be your email
            "password": `456bbva`}
  },
  {
  	headers: { 
    "Content-Type": `application/json`,
    "Authorization":+basicAuth }
}).then((response)=>{  
  console.log('Authenticated');
  console.log(response.data);  
  agent.add(`Done!`);
}).catch(function(error) {
  console.log('Error on Authentication');
  agent.add(`Error en la autenticación: `);
});   
    }
  
  function holaintentoHandler(agent){
 	// new Payload(platform, payload);
    const googlePayloadJson = { expectUserResponse: true, 
                               isSsml: false, 
                               noInputPrompts: [], 
                               richResponse: { 
                                 items: [{ simpleResponse: 
                                          { textToSpeech: 'hello', 
                                           displayText: 'hi' } }] }, 
                               systemIntent: { intent: 'actions.intent.OPTION', } } ;
   // let payload = new Payload(FACEBOOK, {}); 
   // payload.setPayload(googlePayloadJson);
    let payload = new Payload(`Abc`);
    payload.setPayload(googlePayloadJson);
    agent.add(payload);
  }
    function lectorbarraHandler(agent){
      exports.handler = (event, context, callback) => {
  console.log(event);
};
    const imageUrl = agent.request_.body.originalDetectIntentRequest.payload.data.message.attachments[0].payload.url;
    const imagenEncode2= urlencode(imageUrl);
    //agent.add(`Imagen en encode: `+imagenEncode2);
    return axios.get(`https://wabr.inliteresearch.com/barcodes/?url=${imagenEncode2}`)
        .then((response)=>{
        console.log(response.data);
    	console.log(response.status);
    	console.log(response.statusText);
    	console.log(response.headers);
    	console.log(response.config);
      	const q1=JSON.stringify((response.data).Barcodes[0].Text);
      	const q2=q1.replace('"','');
        const qr=q2.replace('"','');
        agent.add(`Su barra dice :`+qr);
      });
    }
  let intentMap = new Map();
  intentMap.set('Twilio', twilioHandler);
  intentMap.set('Twilio2', twilio2Handler);
 // intentMap.set('LectorBarra', lectorbarraHandler);
  intentMap.set('HolaIntento', holaintentoHandler);
  //intentMap.set('RPrueba',rpruebaHandler);
  // intentMap.set('NombreFacebook', nombrefacebookHandler);
  intentMap.set('MandarSMS', mandarsmsHandler);
  intentMap.set('QCrearF', qcrearf);
  intentMap.set('QrFoto', qrfotoHandler);
  intentMap.set('EntregarFinalFoto', entregarfinalfotoHandler);
  intentMap.set('EntregarPendientes', entregarpendientesHandler);
  intentMap.set('EntregarPendiente', entregarpendienteHandler);
  intentMap.set('HoraAmerica', horaamericaHandler);
  intentMap.set('CotizarEnvioFinal', cotizarenviofinalHandler);
  intentMap.set('CotizarEnvioDistrito', cotizarenviodistritoHandler);
  intentMap.set('Cotizar Envio', cotizarenvioHandler);
  intentMap.set('EntregarClientePtoScharff',entregarclienteptoscharffHandler);
  intentMap.set('RegistrarEnvioGuiaFoto', registrarenvioGuiafotoHandler);
  intentMap.set('RegistrarEnvioGuias',registrarenvioguiaHandler);
  //intentMap.set('Default Welcome Intent', welcome);
  //intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('Rimas', rimasHandler);
  intentMap.set('ParametrosConsulta', parametrosHandler);
  intentMap.set('EnviarImagen', enviarimagenHandler);
  intentMap.set('RegistrarEnvioPtoScharff', registrarenvioHandler);
 // intentMap.set('RegistrarEnvioPtoScharff', registrarPtoScharff);
  agent.handleRequest(intentMap);
});