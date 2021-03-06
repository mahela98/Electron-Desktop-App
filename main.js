const electron = require('electron');
const url = require('url');
const path = require('path');

const {
    app,
    BrowserWindow,
    Menu,
    ipcMain
} = electron;
let mainWindow;
let addWindow;

//set ENV
process.env.NODE_ENV ='production';

// listen for app to be ready
app.on('ready', function () {
    //create main window
    mainWindow = new BrowserWindow({ 
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
            // fixed the issue
        }
    });
    //load html in to window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));
    //Quit app wen closed
    mainWindow.on('closed', function () {
        app.quit();
    });
    //build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    //insert menu
    Menu.setApplicationMenu(mainMenu);
});

//handle create add widow
function createAddWindow() {
    //create main window
    addWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: 'Add Shopping List Item',
          
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
            // fixed the issue
        }
      
    });
    //load html in to window
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addWindow.html'),
        protocol: 'file:',
        slashes: true
    }));
    //Garbage collection handle
    addWindow.on('close', function () {
        addWindow = null;
    });
}


//catch item add
ipcMain.on('item:add',function(e,item){
// console.log(item);
    mainWindow.webContents.send('item:add',item);
addWindow.close();

});


//manu template
const mainMenuTemplate = [{
    label: 'File',
    submenu: [{
            label: 'Add Item',
            click() {
                createAddWindow();
            }
        },
        {
            label: 'Clear Items',
            click() {
                mainWindow.webContents.send('item:clear');
            }
        },
        {
            label: 'Quit',
            accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
            click() {
                app.quit();
            }
        }
    ]
}];

//if mac , add empty object to menu
if (process.platform == 'darwin') {
    mainMenuTemplate.unshift({});
}

//add developer tools if not in developer tools
if (process.env.NODE_ENV !== 'production') {
    mainMenuTemplate.push({
        label: 'Developer Tools',
        accelerator: process.platform == 'darwin' ? 'Command+D' : 'Ctrl+D',
        submenu: [{
                label: 'Toggle DevTools',
                click(??tem, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    });

}