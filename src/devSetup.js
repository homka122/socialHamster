import ConversationRepository from "./models/conversation.js"
import MessageRepository from "./models/message.js"
import UserRepository from "./models/user.js"
import authService from "./service/auth.js"

const users = [{
  _id: "63ba398cca62e0ba8b15163f",
  username: "homka122",
  password: "$2a$08$Zh5rgxgdxZa38hMoPVN6XOUlhnl1Hllb5wOFLomjTmu3BRUh3K1Qu",
  role: "ADMIN",
  __v: 0
}, {
  _id: "63ba398dca62e0ba8b151643",
  username: "kirill",
  password: "$2a$08$8xt0VL86gwf9ikcYu21LY.E.yJ/0crwMNYvHcT7mnndU1uPOJXF12",
  role: "USER",
  __v: 0
}, {
  _id: "63ba3996ca62e0ba8b151647",
  username: "amy",
  password: "$2a$08$8HQA3YqcT3/8ow5R11i0NeTv2FEvNX41gEx1N9M4QWpLA/iW5QK4a",
  role: "USER",
  __v: 0
}]

const conversations = [{
  "_id": "63ba409ec6dd1fd1ff9df592",
  "user1": "63ba398cca62e0ba8b15163f",
  "user2": "63ba398dca62e0ba8b151643",
  "__v": 0,
  "lastMessage": "63ba40bfc6dd1fd1ff9df59f"
}]

const messages = [{
  "_id": "63ba40bfc6dd1fd1ff9df59f",
  "sender": "63ba398cca62e0ba8b15163f",
  "text": "привет",
  "createdAt": {
    "$date": {
      "$numberLong": "1673150575678"
    }
  },
  "conversation": "63ba409ec6dd1fd1ff9df592",
  "__v": 0
}, {
  "_id": "63ba40bfc6dd1fd1ff9df59w",
  "sender": "63ba398cca62e0ba8b15163f",
  "text": "привет привет",
  "createdAt": {
    "$date": {
      "$numberLong": "1673150575679"
    }
  },
  "conversation": "63ba409ec6dd1fd1ff9df592",
  "__v": 0
}]

const devSetup = async () => {
  await UserRepository.create(users, { validateBeforeSave: false })
  await ConversationRepository.create(conversations, { validateBeforeSave: false })
  await MessageRepository.create(messages, { validateBeforeSave: false })
  console.log(authService.generateTokens({ username: "homka122", role: "ADMIN" }))
}

export default devSetup;