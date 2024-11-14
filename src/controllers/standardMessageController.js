import * as StandardMessage from '../Models/ModelStandardMessage.js';

export const createStandardMessage = async (req, res) =>{
    const data = req.body;
    const result =  await StandardMessage.createStandardMessage(data);
    if(result.success){
        return res.status(201).json({success: true, id: result.id});
    }
    return res.status(500).json({success: false, message: result.message});
}

export const getStandardMessageById = async(req, res) => {
    const { id } = req.params;
    const result = StandardMessage.getStandardMessageById(id);
    if(result.success){
        return res.status(201).json({ success: true, data: result.data });
    }
    return res.status(404).json({ success: false, message: result.message });
}


export const deleteStandardMessageById = async(req, res) =>{
    const { id } = req.params;
    const result = await StandardMessage.deleteStandardMessageById(id);

    if(result.success){
        return res.json({success: true, message:result.message});
    }
    return res.status(404).json({success: false, message: result.message });
}

export const updateStandardMessage = async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    const result = await StandardMessage.updateStandardMessage(id, data);
  
   if(result.success){
    return res.json({success:true, id});
   } 
   return res.status(404).json({success: false, message: result.message});

}

export const getStandardMessagesByChatId = async (req, res) =>{
    const { chatId } = req.params;
    const result = await StandardMessage.getStandardMessagesByChatId(chatId);

    if(result.success){
        return res.json({success:true, data: result.data});
    }
    return res.status(404).json({success: false, message: result.message});
}