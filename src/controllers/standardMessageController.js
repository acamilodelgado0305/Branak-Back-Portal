import * as StandardMessage from '../Models/ModelStandardMessage.js';
import * as User from '../Models/ModelUser.js';
import * as Teacher from '../Models/ModelTeacher.js';
import * as Student from '../Models/modelStudent.js';


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

export const deleteStandardMessagesByChatId = async(req, res) =>{
    const { chatId } = req.params;
    const result = await StandardMessage.deleteStandardMessagesByChatId(chatId);

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


export const getStandardsMessagesChatsByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await StandardMessage.getMessagesForUser(userId);

    if (!result.success) {
      return res.status(404).json({ success: false, message: result.message });
    }

    const allItems = result.data;
    const groupedMessages = [];
    const chatMap = new Map();
    let chatIndex = 1;

    for (const item of allItems) {
      const chatKey = item.chatId;

      if (!chatMap.has(chatKey)) {
        const otherUserId = item.senderUserId === userId ? item.recipientUserId : item.senderUserId;

        const otherUserCognito = await User.getUserById(otherUserId);
        let otherUser; 
        console.log('role '+JSON.stringify(otherUserCognito.data.role));
        if(otherUserCognito.data.role == "teacher"){
            console.log(otherUserCognito.data.teacherId)
            otherUser = await Teacher.getTeacherById(otherUserCognito.data.teacherId);
        } else {
            console.log(otherUserCognito.data.studentId)
            otherUser = await Student.getStudentById(otherUserCognito.data.studentId);
        }


        chatMap.set(chatKey, chatIndex);
        groupedMessages.push({
          chatIndex,
          messages: [],
          me: userId,
          otherUser, 
        });
        chatIndex++;
      }

      const group = groupedMessages.find((g) => g.chatIndex === chatMap.get(chatKey));
      group.messages.push(item);
    }

    groupedMessages.forEach((group) => {
      group.messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    });

    return res.json({ success: true, data: groupedMessages });
  } catch (error) {
    console.error(`Error in getStandardsMessagesChatsByUserId for user ${userId}:`, error.message);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};




export const getStandardMessagesByChatId = async (req, res) =>{
    const { chatId } = req.params;
    const result = await StandardMessage.getStandardMessagesByChatId(chatId);

    if(result.success){
        return res.json({success:true, data: result.data});
    }
    return res.status(404).json({success: false, message: result.message});
}

