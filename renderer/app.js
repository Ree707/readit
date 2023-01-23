// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const { ipcRenderer } = require("electron");
const items=require('./items')
//show the modal for adding a new item 
const showModal = document.getElementById('show-modal');
const modal =document.getElementById('modal');
let url= document.getElementById('url')
const addItem = document.getElementById('addItem');
const noItem=document.getElementById('noItems');
const search=document.getElementById('search')
//open modal from the menu 
ipcRenderer.on('menu-show-model',()=>{
    showModal.click();
})
//open selected item from the menu 
ipcRenderer.on('open-selected-item',()=>{
    items.open();
})
//delete item from the windo 
ipcRenderer.on('delete-item',()=>{
    let selectedItem=items.getSelectedItem()
    items.delete(selectedItem.index);
})
//open items on native browsers from menu 
ipcRenderer.on('menu-open-item-native',()=>{
    items.openNative()
})
//navigate item selection 
document.addEventListener('keydown',e=>{
    if (e.key=='ArrowUp'|| e.key==='ArrowDown'){
        items.changeSelection(e.key)
    }
})
//filter item when search 
search.addEventListener('keyup',e=>{
    Array.from(document.getElementsByClassName('read-items')).forEach(item =>{
        //hide items that doesnt match 
        let hasMatch=item.innerText.toLowerCase().includes(search.value);
        item.style.display=hasMatch? 'flex':'none'
        //highlight text
       // item.innerHTML.replace(search.value, <mark>${search.value}</mark>)
    })
})

//diable $ enable modal buttons 
const toggleModalButtons=()=>{
    //check state 
    if(addItem.disabled===true){
        addItem.disabled=false;
        addItem.style.opacity=1
        addItem.innerText='Add Item'
        closeModal.style.display='inline';
    }else{
        addItem.disabled=true;
        addItem.style.opacity=0.5
        addItem.innerText='Adding...'
        closeModal.style.display="none";
    }
}
showModal.addEventListener('click', e=>{
    //show the modal 
    modal.style.display="flex"
    url.focus();
})
//cancel button will hide the modal 
const closeModal=document.getElementById('closeModal');
closeModal.addEventListener('click',e=>{
    modal.style.display="none"
})
//display no item if there is no items 
if (true){
    noItem.style.display=("block")
}
//add new item when clicked add item 



addItem.addEventListener('click',e=>{
    toggleModalButtons()
    if (url.value){
        //send to main process 
        ipcRenderer.send('newItem',url.value);
        //disable button
    }
})

//listen for the item detail 
ipcRenderer.on('new-item-success',(e,newItem)=>{
    items.addItem(newItem,true)
    //enable button 
    toggleModalButtons()
    closeModal.click()
})
url.addEventListener('keyup',e=>{
    if (e.key==='Enter'){
        addItem.click();
    }
})

