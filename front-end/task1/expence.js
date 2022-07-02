const token = localStorage.getItem('token');
const userId = JSON.parse(localStorage.getItem('userDetails')); 
const userName=userId[0].name;
const greet=document.getElementById('userName')
greet.innerHTML="Welcome "+userName;
//console.log(userId[0].id)

//dark button functionality


window.addEventListener("DOMContentLoaded", () => {
  axios.get('http://localhost:2500/getexpence', { headers: {"Authorization" : token} })
  .then((res)=>{
    console.log(res)
    const allExpences=res.data.expenses;
    allExpences.forEach((each)=>{
      const parentEl = document.querySelector(".second-container");
      const childEl = `<div id="${each.id}"  class="expence list dynamic">
                                 <p class="list">${each.expence}</p>
                                 <p   class="list">${each.Description}</p>
                                 <p   class="list">${each.category}</p>
                                 <button onclick='deleteExpense( ${each.id})'>
                                 <i class="fa-solid fa-trash-can"></i>
                             </button>
                            </div>`;
      parentEl.innerHTML = parentEl.innerHTML + childEl;
      
    })
  })
  .catch(err=>console.log(err))

  const userIdObj={
    userId:userId[0].id
  }
//console.log(userIdObj.userId)
  axios.post('http://localhost:2500/purchase/checkPremiumMembership' , userIdObj)
  .then((res)=>{
    console.log(res)
    if(res.status===200){
      const premBtn=document.getElementById('premiumBtn');
      premBtn.style.display="none"
      const parEl=document.getElementById('darkBtn');
     //console.log(parEl)
     parEl.style.display="block"
     document.getElementById('Leaderboard').style.display="block"
      //parEl.innerHTML=`<button id="themeBtn"><i class="fa-solid fa-moon"></i></button>`
    }

  })
  .catch(err=> console.log(err))

  
});

const addExpBtn = document.getElementById("addExpBtn");
addExpBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const expence = document.getElementById("expence").value;
  const Description = document.getElementById("Description").value;
  const category = document.getElementById("category").value;


  const expenceObj={
    expence,
    Description,
    category
  }
  axios.post('http://localhost:2500/addexpences', expenceObj,  { headers: {"Authorization" : token} })
  .then((res)=>{
    console.log(res)
    {
      const parentEl = document.querySelector(".second-container");
      const childEl = `<div id="${res.data.expence.id}"  class="expence list dynamic">
                                 <p class="list listItem1">${res.data.expence.expence}</p>
                                 <p  class="list listItem2">${res.data.expence.Description}</p>
                                 <p class="list listItem3">${res.data.expence.category}</p>
                                 <button class="trashBtn" onclick='deleteExpense(event, ${res.data.expence.id})'>
                                 <i class="fa-solid fa-trash-can"></i>
                             </button>
                                   
                                 
                                 
                            </div>`;
      parentEl.innerHTML = parentEl.innerHTML + childEl;
     
    }
  })
  .catch(err=>console.log(err))
  window.location.reload(true)

});

function deleteExpense( expenceid) {
  axios.delete(`http://localhost:2500/deleteExpence/${expenceid}`, { headers: {"Authorization" : token} }).then((response) => {

  if(response.status === 204){
          removeExpensefromUI(expenceid);
      } else {
          throw new Error('Failed to delete');
      }
  }).catch((err => {
      console.log(err);
  }))
}

function removeExpensefromUI(expenseid){
  const expenseElemId = `${expenseid}`;
  document.getElementById(expenseElemId).remove();
}

// logout
document.querySelector('.logout').onclick=()=>{
  window.location.href = "/login.html"
}

function showError(err){
  document.body.innerHTML += `<div style="color:red;"> ${err}</div>`
}

//payment via razorpay

document.getElementById('premiumBtn').onclick = async function (e) {
  const response  = await axios.get('http://localhost:2500/purchase/premiummembership', { headers: {"Authorization" : token} });
  console.log(response);
  var options =
  {
   "key": response.data.key_id, // Enter the Key ID generated from the Dashboard
   "name": "YAV Technology",
   "order_id": response.data.order.id, // For one time payment
   "prefill": {
     "name": "Yash Prasad",
     "email": "prasadyash2411@gmail.com",
     "contact": "7003442036"
   },
   "theme": {
    "color": "#3399cc"
   },
   // This handler function will handle the success payment
   "handler": function (response) {
       console.log(response);
       axios.post('http://localhost:2500/purchase/updatetransactionstatus',{
           order_id: options.order_id,
           payment_id: response.razorpay_payment_id,
       }, { headers: {"Authorization" : token} }).then(() => {
           alert('You are a Premium User Now') 
            window.location.reload(true)

       }).catch(() => {
           alert('Something went wrong. Try Again!!!')
       })
   },
};
const rzp1 = new Razorpay(options);
rzp1.open();
e.preventDefault();

rzp1.on('payment.failed', function (response){
alert(response.error.code);
alert(response.error.description);
alert(response.error.source);
alert(response.error.step);
alert(response.error.reason);
alert(response.error.metadata.order_id);
alert(response.error.metadata.payment_id);
});
}

function download(){
  axios.get('http://localhost:2500/download')
  .then((response) => {
    console.log(responce)

      if(response.status === 201){
          //the bcakend is essentially sending a download link
          //  which if we open in browser, the file would download
          var a = document.createElement("a");
          a.href = response.data.fileUrl;
          a.download = 'myexpense.csv';
          a.click();
      } else {
          throw new Error(response.data.message)
      }

  })
  .catch((err) => {
      showError(err)
  });
}