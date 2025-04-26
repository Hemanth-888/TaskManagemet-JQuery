
function LoadView(url){
    $.ajax({
        method: 'get',
        url: url,
        success: (response)=>{
             $("section").html(response);
        }
    });
}

// jQuery Load Action 

$(()=>{

     LoadView('./home.html');

     $(document).on('click', '#home-register-button', ()=>{
          LoadView('./register.html');
     })

     $(document).on('click', '#home-login-button', ()=>{
        LoadView('./login.html');
     })

     $(document).on('click', '#btn-home', ()=>{
        LoadView('./home.html');
     })

     // Verify User Name

     $(document).on('keyup', '#txtUserName', ()=>{

          $.ajax({
               method: 'get',
               url: 'http://localhost:4040/users',
               success: (users)=>{
                   for(var user of users){
                       if(user.username===$("#txtUserName").val()){
                            $("#lblUserError").html('User Name Taken - Try Another').css("color","red");
                            break;
                       } else {
                            $("#lblUserError").html('User Name Available').css("color","green");
                       }
                   }
               }
          })

     })


     // Register Click 

     $(document).on('click', '#btnRegister',()=>{

          var user = {
               username: $("#txtUserName").val(),
               password: $("#txtPassword").val(),
               email: $("#txtEmail").val()
          };

          $.ajax({
               method: 'post',
               url: 'http://localhost:4040/users',
               data: JSON.stringify(user)
          });
          alert('Registered Successfully..');
     });


     // Login Click

     $(document).on('click', '#btnLogin', ()=>{

            $.ajax({
               method: 'get',
               url: 'http://localhost:4040/users',
               success: (users)=>{
                    var user = users.find(item=> item.username===$("#txtUserName").val());
                    if(user){
                         if(user.password===$("#txtPassword").val()){
                              $.cookie('uname', $("#txtUserName").val(),{expires:2});
                              $.ajax({
                                   method:'get',
                                   url: './dashboard.html',
                                   success: (response)=>{
                                        $("section").html(response);
                                        $("#active-user").html($.cookie('uname'));
                                        $.ajax({
                                             method:'get',
                                             url:'http://localhost:4040/appointments',
                                             success:(appointments=>{
                                                  
                                                  var results = appointments.filter(appointment=> appointment.username===$.cookie('uname'));

                                                  results.map(appointment=>{
                                                        $(`<div class="alert alert-success">
                                                            <h3>${appointment.title}</h3>
                                                            <p>${appointment.description}</p>
                                                            <div class="bi bi-calendar"> ${appointment.date} </div>
                                                            <div>
                                                              <button class="bi bi-pen-fill btn btn-warning"></button>
                                                              <button class="bi bi-trash-fill btn btn-danger mx-2"></button>
                                                            </div>
                                                        </div>`).appendTo("#appointment-cards");
                                                  })
                                             })
                                        })
                                   }
                              })                 
                         } else {
                              alert('Invalid Password');
                         }
                    } else {
                         alert('Invalid User Name');
                    }
               }
            })
     })

     // Signout Click

     $(document).on('click', '#btn-signout', ()=>{

          $.removeCookie('uname');
          LoadView('./home.html');

     })



})