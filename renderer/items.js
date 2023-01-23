const { shell } = require('electron')
const fs =require('fs')
let items =document.getElementById('items')
//get readerJS file 
let readerJS
fs.readFile(`${__dirname}/reader.js`,(err,data)=>{
    readerJS=data.toString()
})
//array of items 
exports.storage=JSON.parse(localStorage.getItem('readit-items'))|| []

//listen to done messgae coming from window childe 
window.addEventListener('message',e=>{
    console.log(e.data);
    //delete item at given index
    if (e.data.action==='delete-reader-item'){
        this.delete(e.data.itemIndex)
        //close the rendere window 
        e.source.close()

    }
})
//delete item function 
exports.delete=itemIndex=>{
    //remove item from DOM 
    items.removeChild(items.childNodes[itemIndex]);
    //remove item from storage 
    this.storage.splice(itemIndex,1);
    //presist storage 
    this.save()
    //select another item 
    if (this.storage.length){
        let = newSelectedItemIndex =(itemIndex===0)?0:itemIndex-1
        //select item at new index
        document.getElementsByClassName('read-items')[newSelectedItemIndex].classList.add('selected')
    }
}
//presist storage
exports.save =()=>{
    localStorage.setItem('readit-items',JSON.stringify(this.storage))
}
//get index of that item 
exports.getSelectedItem = ()=>{
    let currentItem=document.getElementsByClassName('read-items selected')[0]

    //get item index (there is a problem with indexing )
    let itemIndex=0
    let child=currentItem
    while( (child=child.previousElementSibling)!=null) {
        itemIndex++
    }
    return{node:currentItem,index:itemIndex}
}
//set item as selected 
exports.select =e =>{
    this.getSelectedItem().node.classList.remove('selected')
    //add selected item 
    e.currentTarget.classList.add('selected')
}

//move to newly selected item by arrow 
exports.changeSelection=direction=>{
    let currentItem =    this.getSelectedItem()
    //
    if (direction==='ArrowUp'&&currentItem.node.previousElementSibling){
        currentItem.node.classList.remove('selected')
        currentItem.node.previousElementSibling.classList.add('selected')
    }else if(direction==='ArrowDown'&&currentItem.node.nextElementSibling){
        currentItem.node.classList.remove('selected')
        currentItem.node.nextElementSibling.classList.add('selected')
    }
}
exports.openNative=()=>{
    if(!this.storage.length) return 
    
    let selectedItem=this.getSelectedItem()
    let contentURL =selectedItem.node.dataset.url

    //open in defualt broswer 
    shell.openExternal(contentURL)
}
exports.open=()=>{
    //check if we have items 
    if(!this.storage.length) return 
    
    let selectedItem=this.getSelectedItem()
    let contentURL =selectedItem.node.dataset.url
    //open item in proxy windows 
    let readWin=window.open(contentURL,'',`
    maxWidth=2000,
    maxHeight=2000,
    width=1200,
    height=800,
    backgroundColor=#DEDEDE,
    nodeIntegration=0,
    contextIsolation=1
    `)
    //inject JavaScript 
    readWin.eval(readerJS.replace('{{index}}',selectedItem.index));

}
exports.addItem=(item, isNew=false)=>{

    //create html element 
    let itemNode=document.createElement('div')
    itemNode.setAttribute('class','read-items')
    //set item url as data attirbute 
    itemNode.setAttribute('data-url',item.url)


    itemNode.innerHTML=`<img src="${item.screenshot}"><h2>${item.title}</h2>`
    items.appendChild(itemNode)

    //select the first item 
    if (document.getElementsByClassName('read-items').length===1){
        itemNode.classList.add('selected')
    }
    
    //select an item with one click 
    itemNode.addEventListener('click',this.select)

    //open an item with double click 
    itemNode.addEventListener('dblclick',this.open)

    
    //add item to storage 
    if(isNew){
        this.storage.push(item)
        this.save()
    }
    
}

//add items from storge when refresh 
this.storage.forEach(item => {
    this.addItem(item);
});