const WebSocket = require('ws');

export default function createWebsocket(server) {
  const wss = new WebSocket.Server({ server });
  let allClients = [];

  wss.on('connection', (client) => {
    let subscribedTopics = [];
    let publishingTopics = [];
    let sendInterval;
    client['subscribedTopics'] = subscribedTopics;
    client['publishingTopics'] = publishingTopics;

    client.on('message', (message) => {
      if(message.type) {
        switch (message.type && message.topicName) {
          case SUBSCRIBE:
            if(!subscribedTopics.includes(message.topicName)){
              subscribedTopics.push(message.topicName);
            }
            break;

          case UNSUBSCRIBE:
            subscribedTopics = subscribedTopics.filter(currentName => currentName != message.topicName);
            break;

          case PUBLISH:
            if(!publishingTopics.includes(message.topicName)){
              publishingTopics.push(message.topicName);
            }
            break;

          case UNPUBLISH:
            publishingTopics = publishingTopics.filter(currentName => currentName != message.topicName);
            break;
        
          default:
            break;
        }
      } else {
        console.log('Received unknown message: ', message);
      }
    });

    client.on('close', () => {
      //todo
      //CLOSE all PUBLISH and SUBSCRIBE Topics

      allClients = allClients.filter(currentClient => currentClient != client);
      console.log("Disconnect ...");
      console.log("Number of connected clients: " + allClients.length);
    })

    sendInterval = setInterval(() => {
      allClients.forEach(tmpClient => {
        tmpClient.subscribedTopics.forEach(topicName => {
          tmpClient.send({
            topicName: topicName,
            data: "test"
          })
        });
      })
    }, 3000);

    allClients.push(client);
    console.log("Connect ...");
    console.log("Number of connected clients: " + allClients.length);
  });
}