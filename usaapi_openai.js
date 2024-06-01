const OpenAI = require('openai');
const model = "gpt-3.5-turbo";
require("dotenv").config();

const apiKey       = process.env.OPENAI_API_KEY;
const organization = process.env.ORG;
const openai       = new OpenAI({
 apiKey: apiKey,
 organization: organization 
});
 
 async function consultaOpenAI(loqueviene) {
   console.log('consultaOpenAI');
   var textoresultante= '';
   try {
    const response = await openai.chat.completions.create({
     model: model,
     messages: [{ 
        role: 'user', 
        content: loqueviene 
       }],
     max_tokens: 800
   });
   if (response.choices && response.choices.length > 0 && response.choices[0].message && response.choices[0].message.content) {
    textoresultante = response.choices[0].message.content;
    console.log('response[]:', textoresultante);
    console.log("ChatGPT:", textoresultante, '<END>.');
    return textoresultante;
    } else {
    console.error("Respuesta incompleta o nula.");
    return "Respuesta incompleta o nula."; 
    }
} catch (error) {
     console.error("Error al obtener la completitud:", error);
   }
}
 module.exports = consultaOpenAI;