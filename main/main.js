'use strict';
//const loadAllItems=require('../test/fixtures')

  function printReceipt(barcodesArray){
    var cartItemsArray=formatItemObject(barcodesArray)
    var receiptInfoObj=colculateTotal(cartItemsArray)
    var itemsStr=""
    for(let item of receiptInfoObj.cartItemsArray){
        itemsStr+="名称："+item.name+"，数量："+item.quantity+item.unit+"，单价："+item.price.toFixed(2)+"(元)，"+"小计："+item.nowMoney+"(元)\n"
    }
    itemsStr+='----------------------'
    var receiptStr= `***<没钱赚商店>收据***
${itemsStr}
总计：${receiptInfoObj.total.toFixed(2)}(元)
节省：${receiptInfoObj.saveMoneyTotal.toFixed(2)}(元)
**********************`
   console.log(receiptStr)
  }
  function colculateTotal(cartItemsArray){
    var cartItemsAry=cartItemsArray
    var smallTotal=[]
    var saveTotal=[]
    var promotionWays=loadPromotions()
    var promotionBarcodesList=promotionWays[0].barcodes
    for(let cartItem of cartItemsAry){
        if(promotionBarcodesList.indexOf(cartItem.barcode)){
            let colQuantity=cartItem.quantity-Math.floor(cartItem.quantity/3)
            let nowMoney=colQuantity*cartItem.price
            let saveMoney=(cartItem.quantity*cartItem.price)-nowMoney
            cartItem.nowMoney=nowMoney.toFixed(2)//向每个优惠物品对象存入小计的金额
            smallTotal.push(Number(nowMoney.toFixed(2)))
            saveTotal.push(Number(saveMoney.toFixed(2)))
        }
        else{
            let nowMoney=(cartItem.quantity*cartItem.price).toFixed(2)
            cartItem.nowMoney=nowMoney//向每个不参加优惠的物品对象存入小计的金额
            smallTotal.push(Number(nowMoney))
        }
    }
    var receiptInfoObj={}
    var totals=smallTotal.reduce(getSum)
    receiptInfoObj.total=totals//总价存入receiptInfoObj
    var saveMoneyTotals=saveTotal.reduce(getSum)
    receiptInfoObj.saveMoneyTotal=saveMoneyTotals//节省的金额存入receiptInfoObj
    receiptInfoObj.cartItemsArray=cartItemsAry//将购物车物品的详细信息存入receiptInfoObj
    return receiptInfoObj
  }
  function getSum(total,num){
      return total+parseFloat(num);
  }
  function formatItemObject(barcodesArray){
    var database=loadAllItems()
    var itemQuantity=colculateItemQuantity(barcodesArray)
    var cartItem=[]
    for(let item of Object.keys(itemQuantity)){
        for(let dbItem of database)
        if(dbItem.barcode==item)
        {
            let objItem={}
            objItem.barcode=dbItem.barcode;
            objItem.name=dbItem.name;
            objItem.unit=dbItem.unit;
            objItem.price=dbItem.price;
            objItem.quantity=itemQuantity[item]
            cartItem.push(objItem) 
        }
    }
    return cartItem;
  }
function colculateItemQuantity(barcodesArray){
    var objItem={}
    for(let item of barcodesArray){
        if(item.indexOf("-")!= -1){
            var array=item.split("-")
            var key=array[0]
            var quanlity=array[1]
            if(objItem.hasOwnProperty(key)){
                objItem[key]=parseFloat(objItem[key])+parseFloat(quanlity) 
            }else{
                objItem[key]=parseFloat(quanlity)
            }
            //objItem[key]=(objItem[key])+array[1] || quanlity
        }else{
            objItem[item]=(objItem[item])+1||1
        }
    }
    return objItem
  }
  
  //formatItemObject(tags)