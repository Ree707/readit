const {Menu, shell, ipcRenderer} =require('electron')

module.exports=appWin=>{

    //menu template 
    let template =[
        {
            label:'Items',
            submenu:[
                {
                    label:'add new',
                    click:()=>{
                        //send IPC msg to main window 
                        appWin.send('menu-show-model')
                    }
                },
                {
                    label:'Read Item',
                    click:()=>{
                        appWin.send('open-selected-item')
                    }
                },
                {
                    label:'Delete Item',
                    click: ()=>{
                        appWin.send('delete-item')
                    }
                },
                {
                    label:'open in browser',
                    click:()=>{
                        appWin.send('menu-open-item-native')
                    }
                }
            ]
        },
        {
            role:'editMenu'
        },
        {
            role:'windowMenu'
        },
        {
            role:'help',
            submenu:[
                {
                    label:'learn more',
                    click:()=>{
                        shell.openExternal('https://github.com/Ree707?tab=repositories')
                    }
                }
            ]
        },
    ]
    //build menu 
    let menu = Menu.buildFromTemplate(template)
    //set as main app menu 
    Menu.setApplicationMenu(menu)
}