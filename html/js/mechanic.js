Setupmechs = function(data) {
    $(".mechs-list").html("");

    if (data.length > 0) {
        $.each(data, function(i, mech){
            var element = '<div class="mech-list" id="mechid-'+i+'"> <div class="mech-list-firstletter">' + (mech.name).charAt(0).toUpperCase() + '</div> <div class="mech-list-fullname">' + mech.fran + mech.name + '</div> <div class="mech-list-call"><i class="fas fa-phone"></i></div> </div>'
            $(".mechs-list").append(element);
            $("#mechid-"+i).data('mechData', mech);
        });
    } else {
        var element = '<div class="mech-list"><div class="no-mechs">لا يوجد ميكانيكي بالوقت الحالي ..</div></div>'
        $(".mechs-list").append(element);
    }
}

$(document).on('click', '.mech-list-call', function(e){
    e.preventDefault();

    var mechData = $(this).parent().data('mechData');
    
    var cData = {
        number: mechData.phone,
        name: mechData.name
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
                            $(".mechs-app").css({"display":"none"});
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