Setuptows = function(data) {
    $(".tows-list").html("");

    if (data.length > 0) {
        $.each(data, function(i, tow){
            var element = '<div class="tow-list" id="towid-'+i+'"> <div class="tow-list-firstletter">' + (tow.name).charAt(0).toUpperCase() + '</div> <div class="tow-list-fullname">' + tow.fran + tow.name + '</div> <div class="tow-list-call"><i class="fas fa-phone"></i></div> </div>'
            $(".tows-list").append(element);
            $("#towid-"+i).data('towData', tow);
        });
    } else {
        var element = '<div class="tow-list"><div class="no-tows">لا يوجد سطحة متوفرة بالوقت الحالي.</div></div>'
        $(".tows-list").append(element);
    }
}

$(document).on('click', '.tow-list-call', function(e){
    e.preventDefault();

    var towData = $(this).parent().data('towData');
    
    var cData = {
        number: towData.phone,
        name: towData.name
    }

    $.post('http://qb-phone_new/CallContact', JSON.stringify({
        ContactData: cData,
        Anonymous: QB.Phone.Data.AnonymousCall,
    }), function(status){
        if (cData.number !== QB.Phone.Data.PlayerData.charinfo.phone) {
            if (status.IsOnline) {
                if (status.CanCall) {
                    if (!status.InCall) {
                        if (QB.Phone.Data.AnonymousCall) {
                            QB.Phone.Notifications.Add("fas fa-phone", "Phone", "You have started an anonymous call!");
                        }
                        $(".phone-call-outgoing").css({"display":"block"});
                        $(".phone-call-incoming").css({"display":"none"});
                        $(".phone-call-ongoing").css({"display":"none"});
                        $(".phone-call-outgoing-caller").html(cData.name);
                        QB.Phone.Functions.HeaderTextColor("white", 400);
                        QB.Phone.Animations.TopSlideUp('.phone-application-container', 400, -160);
                        setTimeout(function(){
                            $(".tows-app").css({"display":"none"});
                            QB.Phone.Animations.TopSlideDown('.phone-application-container', 400, 0);
                            QB.Phone.Functions.ToggleApp("phone-call", "block");
                        }, 450);
    
                        CallData.name = cData.name;
                        CallData.number = cData.number;
                    
                        QB.Phone.Data.currentApplication = "phone-call";
                    } else {
                        QB.Phone.Notifications.Add("fas fa-phone", "Phone", "You are already busy!");
                    }
                } else {
                    QB.Phone.Notifications.Add("fas fa-phone", "Phone", "This person is on the phone!");
                }
            } else {
                QB.Phone.Notifications.Add("fas fa-phone", "Phone", "This person is not available!");
            }
        } else {
            QB.Phone.Notifications.Add("fas fa-phone", "Phone", "You cannot call your own number!");
        }
    });
});