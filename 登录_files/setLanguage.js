function switchLanguage() {
    $.ajax({
        url: _CP_ + "/switchLanguage",
        data: {},
        dataType: "json",
        type: "post",
        async: false,
        success: function (data) {
            window.location.reload();
        }
    });

}