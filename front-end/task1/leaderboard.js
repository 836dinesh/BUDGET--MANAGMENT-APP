window.addEventListener("DOMContentLoaded", () =>{
    axios.get('http://localhost:2500/purchase/getallpremusers')
    .then((res)=>{
        const premUsers=res.data.orders;
        //console.log(premUsers)
        premUsers.forEach(user=>{
            const userId=user.userId
            const userIdObj={
                userId
            }
            axios.post('http://localhost:2500/getallpremusersfromusertable',userIdObj)
            .then((res)=>{
                const usernames=res.data.users
                usernames.forEach(username=>{
                   // console.log(username.name)
                    const parEl=document.getElementById('expencelist')
                    parEl.innerHTML=parEl.innerHTML + `<div class="index">
                    <h3 class="name">${username.name}</h3>
                    
                </div>`
                })
            })
            .catch(err => console.log(err))

            axios.post('http://localhost:2500/getallexpences',userIdObj)
            .then((res)=>{
                const userExpence=res.data.expences
                //console.log(userExpence)
                userExpence.forEach(expence=>{
                    let totalExpence=0;
                    //console.log(expence)
                    // if(expence.length==0){
                    //     const parEl2=document.getElementById('expencelist')
                    //     parEl2.innerHTML=parEl2.innerHTML + `
                                                            
                    //                                         <h3 class="totalexpense2">000</h3>
                    //                                 `
                    // }else {
                    //    let currexpence=parseInt(expence.expence)
                    //     totalExpence=currexpence+ totalExpence
                    //     console.log(totalExpence)
                    //     const parEl2=document.getElementById('expencelist')
                    //     parEl2.innerHTML=parEl2.innerHTML + `<div class="index">
                    //     <h3 class="name">dinesh</h3>
                    //     <h3 class="totalexpense">500</h3>
                    // </div>`
                    // }
                })
            })
            .catch(err=> console.log(err))
        })

    })
    .catch(err => console.log(err))
})