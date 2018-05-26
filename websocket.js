const WebSocket = require('ws');
import readJSONFile from './tools/utils';

export default function createWebsocket(server) {
  const wss = new WebSocket.Server({ server });
  const intervalTime = 3000;
  let allClients = [];

  wss.on('connection', (client) => {
    // ############# Open connection to one client ################
    let subscribedTopics = [];
    let publishingTopics = [];
    client['subscribedTopics'] = subscribedTopics;
    client['publishingTopics'] = publishingTopics;
    allClients.push(client);
    console.log("Connect ...");
    console.log("Number of connected clients: " + allClients.length);

    // ############# procceed message from this client ################
    client.on('message', (message) => {
      if (message.type) {
        switch (message.type && message.topicName) {
          case SUBSCRIBE:
            if (!subscribedTopics.includes(message.topicName)) {
              subscribedTopics.push(message.topicName);
            }
            break;

          case UNSUBSCRIBE:
            subscribedTopics = subscribedTopics.filter(currentName => currentName != message.topicName);
            break;

          case PUBLISH:
            if (!publishingTopics.includes(message.topicName)) {
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

    // ############# close connection to this client ################
    client.on('close', () => {
      //todo
      //CLOSE all PUBLISH and SUBSCRIBE Topics
      allClients = allClients.filter(currentClient => currentClient != client);
      console.log("Disconnect ...");
      console.log("Number of connected clients: " + allClients.length);
    })
  });

  // ############# Websocket Runtime ################
  setInterval(() => {
    console.log("WS interval tick ...")
    allClients.forEach(tmpClient => {
      tmpClient.subscribedTopics.forEach(tmpTopicName => {
        readJSONFile('tools/data/data_' + tmpTopicName + '.json', (err, tmpData) => {
          if (err) {
            tmpClient.send(JSON.stringify({
              topicName: tmpTopicName,
              error: err
            }));
          } else {
            tmpClient.send(JSON.stringify({
              topicName: tmpTopicName,
              data: tmpData
            }));
          }
          return;
        });
      });
    })
  }, intervalTime);
}