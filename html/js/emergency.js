Setupemergencys = function(data) {
    $(".emergencys-list").html("");

    if (data.length > 0) {
        $.each(data, function(i, emergency){
            var element = '<div class="emergency-list" id="emergencyid-'+i+'"> <div class="emergency-list-firstletter">' + (emergency.name).charAt(0).toUpperCase() + '</div> <div class="emergency-list-fullname">' + emergency.name + '</div> <div class="emergency-list-call"><i class="fas fa-phone"></i></div> </div>'
            $(".emergencys-list").append(element);
            $("#emergencyid-"+i).data('emergencyData', emergency);
        });
    } else {
        var element = '<div class="emergency-list"><div class="no-emergencys">There are no services available.</div></div>'
        $(".emergencys-list").append(element);
    }
}

$(document).on('click', '.emergency-list-call', function(e){
    e.preventDefault();

    var emergencyData = $(this).parent().data('emergencyData');
    
    var cData = {
        number: emergencyData.phone,
        name: emergencyData.name
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
                            $(".emergencys-app").css({"display":"none"});
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