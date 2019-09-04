const im_tel = new Inputmask("+7 (999) 999-99-99", {
    positionCaretOnClick: "radixFocus",
    showMaskOnHover: false,
    clearIncomplete: true
});

const im_email = new Inputmask({
    mask: "*{1,20}[.*{1,20}][.*{1,20}][.*{1,20}]@*{1,20}[.*{2,6}][.*{1,2}]",
    greedy: false,
    positionCaretOnClick: "radixFocus",
    showMaskOnHover: false,
    clearIncomplete: true,
    onBeforePaste: function (pastedValue, opts) {
        pastedValue = pastedValue.toLowerCase();
        return pastedValue.replace("mailto:", "");
    },
    definitions: {
        '*': {
            validator: "[0-9A-Za-z!#$%&'*+/=?^_`{|}~\-]",
            casing: "lower",
        }
    }
});

let form             = document.getElementById("form-feedback"),
    requiredElements = Array.from(form.elements).filter(elem => elem.required),
    file             = document.getElementById("field-feedback__file"),
    btnRemoveFile    = document.getElementById("file-remove");

$(function() {
    requiredElements = requiredElements.map(function(item) {
        item.required = false;
        item.classList.add("required");

        if (item.type == "tel") {
            im_tel.mask(item);
        }

        if (item.type == "email") {
            item.type = "text";
            im_email.mask(item);
        }

        return item;
    });

    form.addEventListener("submit", function(e) {
        e.preventDefault();
    
        if (validation() == false) {
            setTimeout(function() {
                $(".invalid").removeClass("invalid");
             }, 1000);
            showNoty("error", "Заполните все обязательные (*) поля!");
        } else {
            grecaptcha.execute();
        }
    });

    if (file !== null) {
        file.addEventListener("change", selectFile);
    }

    if (btnRemoveFile !== null) {
        btnRemoveFile.addEventListener("click", removeFile);
    }
});

function validation() {
    let continueSubmit = true;

    for (item of requiredElements) {
        if (item.value == "" || item.checkValidity() == false) {
            item.classList.add("invalid");
            continueSubmit = false;
        } else {
            item.classList.remove("invalid");
        }
    }

    return continueSubmit;
}

function submitForm() {
    let formData   = new FormData(form),
        formAction = form.action;

    $.ajax({
        url: formAction,
        method: "POST",
        data: formData,
        async: false,
        processData: false,
        contentType: false,
        dataType: "JSON",
    })
    .done(function(response) {
        switch (response["status"]) {
            case "error":
                showNoty("error", response["message"]);
                break;
                
            case "success":
                showNoty("success", response["message"]);
                break;
        }

        console.log("success: ", response);
    })
    .fail(function (xhr, status, desc) {
        showNoty("error", "Во время отправки произошла ошибка. Пожалуйста, передайте нам следующую информацию: <br>" + "Статус ошибки: " + status + "<br>" + "Описание ошибки: " + desc);
        console.log("fail", "status: " + status + " description: " + desc);
    })
    .always(function() {
        grecaptcha.reset();
        form.reset();
        removeFile();
    });
}

// ================

function selectFile(e) {
    let input = e.target,
        fname = input.value.replace(/C:\\fakepath\\/i, '');

    if (Math.ceil(input.files[0].size / 1024 / 1024) > 10) {
        showNoty("error", "Ваш файл превышает 10МБ!");
        return false;
    }

    input.classList.add("not-empty");

    document.getElementById("file-name").innerHTML = fname;
    document.getElementById("file-name").title = fname;
    document.getElementById("file-info").classList.remove("hidden");
}

function removeFile() {
    document.getElementById("field-feedback__file").classList.remove("not-empty");
    document.getElementById("field-feedback__file").value = "";

    document.getElementById("file-info").classList.add("hidden");
    document.getElementById("file-name").innerHTML = "";
    document.getElementById("file-name").title = "";
}

function showNoty(_type, _text) {
    new Noty({
        theme: "metroui",
        layout: "bottomLeft",
        animation: {
            open: 'animated bounceInLeft',
            close: 'animated bounceOutLeft'
        },
        text: _text,
        type: _type,
        timeout: 3000
    }).show();
}