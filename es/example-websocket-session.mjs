// --------------------------------------------------------------------------
// -- example-websocket-session.mjs
// -- initial author: Renick Bell (renick@gmail.com)
// -- initial creation date: Wed Jun 28 10:08:48 AM CST 2023
// -- contributors: Yiler Huang (yiler7777@gmail.com); Steve Wang (stevesg168@gmail.com)
// -- license: GPL 3.0
// --------------------------------------------------------------------------

//const wss = new WebSocketServer.Server({ port: findAvailablePorts(8080, 8090)});


export let clients = [];

export let newResponseTimes = []

export let commands = [
    {
        action: "hi",
        func: function () {
            console.log("hi");
        },
    },{
        action: "recordResponseTime",
        func: function (info){
            newResponseTimes.push(info.date)
        }
    }
];

// Creating connection using websocket
export function createDefaultWebsocketServer () {
    const wss = new WebSocketServer.Server({ port: 8080});
    wss.on("connection", (ws) => {
        console.log("new client connected");
        addNewClients()
        ws.onmessage = (e) => {
            console.log('data received')
            let data = JSON.parse(e.data)
            if (data != undefined) {
                //console.log("command received",e.target, e.data);
                receiveCommands(data, e.target);
            }
        };
        // handling what to do when clients disconnects from server
        ws.on("close", () => {
            removeClient(ws)
            console.log("the client has connected");
        });
        // handling client connection error
        ws.onerror = function () {
            console.log("Some Error occurred");
        };
    });
    return wss
}
