const WebSocket = require('ws');
import readJSONFile from './tools/utils';

export default function createWebsocket(server) {
  const wss = new WebSocket.Server({
    server
  });
  const intervalTime = 2000;
  let idCount = 0;
  let allClients = [];

  wss.on('connection', (client) => {
    // ############# Open connection to one client ################
    client['subscribedTopics'] = [];
    client['publishingTopics'] = [];
    allClients.push(client);
    console.log('Connect ...');
    console.log('Number of connected clients: ' + allClients.length);

    // ############# procceed message from this client ################
    client.on('message', (data) => {
      const message = JSON.parse(data);

      if (message.action && message.topicName) {
        switch (message.action) {
          case 'SUBSCRIBE':
            if (!client.subscribedTopics.includes(message.topicName)) {
              client.subscribedTopics.push(message.topicName);
            }
            break;

          case 'UNSUBSCRIBE':
            client.subscribedTopics = client.subscribedTopics.filter(currentName => currentName != message.topicName);
            break;

          case 'PUBLISH':
            if (!client.publishingTopics.includes(message.topicName)) {
              client.publishingTopics.push(message.topicName);
            }
            break;

          case 'UNPUBLISH':
            client.publishingTopics = client.publishingTopics.filter(currentName => currentName != message.topicName);
            break;

          case 'NEWDATA':
            console.log('New data from Topic:', message.topicName);
            console.log(message.data);
            break;

          default:
            break;
        }
        console.log('client updated: sub ->', client.subscribedTopics, ' pub ->', client.publishingTopics);
      } else {
        console.log('Received unknown message: ', message);
      }
    });

    // ############# close connection to this client ################
    client.on('close', () => {
      //todo
      //CLOSE all PUBLISH and SUBSCRIBE Topics
      allClients = allClients.filter(currentClient => currentClient != client);
      console.log('Disconnect ...');
      console.log('Number of connected clients: ' + allClients.length);
    })
  });

  // ############# Websocket Runtime ################
  setInterval(() => {
    console.log('WS interval tick ...');
    idCount++;
    let idTmp = 0;
    idCount % 2 == 0 ? idTmp = idCount : idTmp = idCount - 1;
    allClients.forEach(tmpClient => {
      tmpClient.subscribedTopics.forEach(tmpTopicName => {
        readJSONFile('tools/data/data_' + tmpTopicName + '.json', (err, tmpData) => {
          if (err) {
            tmpClient.send(JSON.stringify({
              topicName: tmpTopicName,
              error: err
            }));
          } else {
            tmpData['timestamp'] = Date.now();
            tmpData['id'] = idTmp;
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