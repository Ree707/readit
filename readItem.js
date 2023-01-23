const {BrowserWindow}=require('electron')

let offscreenWindow

module.exports=(url,callback)=>{

    offscreenWindow=new BrowserWindow({
        width:500,
        width:500,
        show:false,
        webPreferences:{
            offscreen:true
        }
    })

    //load url 
    offscreenWindow.loadURL(url)

    offscreenWindow.webContents.on('did-finish-load',e=>{
        let title=offscreenWindow.getTitle()
        offscreenWindow.webContents.capturePage().then(image =>{
            let screenshot=image.toDataURL();

            callback({title,screenshot,url})

            //clean up
            offscreenWindow.close()
            offscreenWindow=null
        })
    })
}