(function() {
    $('#form_filter_user').on('input', debounce(function () {
        const $this = $(this);

        $.ajax({
            url: $this.attr('action'),
            type: $this.attr('method'),
            data: $this.serialize(),
            dataType: 'html',
            success: function (data) {
                $('.user-table').html(data);
            }
        });
    }, 250));
    /* Requête à partir de la pagination ou du trie. */
    $(document).delegate('.user-table .pagination a, .user-table a.sort', 'click', function (evt) {
        evt.preventDefault();
        const $this = $(this);

        $.ajax({
            url: $this.attr('href'),
            type: 'GET',
            dataType: 'html',
            success: function (data) {
                $('.user-table').html(data);
            }
        });
    });
})();

function sortRole(evt) {
    var weight = 1;

    $(evt.from).find('input[name^="role_weight"]').each(function () {
        $(this).val(weight);
        weight++;
    });
}

function togglePassword(button, idPasswordInput) {
    let passwordInput = document.getElementById(idPasswordInput);

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        button.firstChild.classList.add("fa-eye-slash");
    } else {
        passwordInput.type = 'password';
        button.firstChild.classList.remove("fa-eye-slash");
    }
}

function getRandomColor() {
    const letters = "0123456789abcdef";
    let color = "#";
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
}

function passwordPolicy(idPasswordInput)
{
    const value = idPasswordInput.value;
    const elements = document.querySelectorAll('#password_policy li');

    elements.forEach(function (el, i) {
        const reg = new RegExp(el.dataset.pattern);
        if (reg.test(value)) {
            el.style.color = 'green';
        } else {
            el.style.color = 'inherit';
        }
    });
}

function searchPermission()
{
    const search = $('#search').val();
    const reg = new RegExp(search, 'i');
    let number = 0;

    $('.modules').each(function () {
        var package_hide = 'none';

        $(this).find('.permission').each(function () {
            $(this).css('display', '');

            if (reg.test($(this).data('title'))) {
                const str = strHighlight(search, $(this).data('title'));
                $(this).find('.str-search').html(str);

                number++;
                package_hide = '';
            } else {
                $(this).css('display', 'none');
            }
            ;
        });

        $(this).css('display', package_hide);
        /* Pour l'affichage de la navigation. */
        $(`#nav-${this.id}`).css('display', package_hide);
    });

    if (number === 0) {
        $('#form-permission').css('display', 'none');
        $('#permission-nothing').css('display', '');
    } else {
        $('#form-permission').css('display', '');
        $('#permission-nothing').css('display', 'none');
    }

    $('#result-search').text(
            number <= 1
            ? `${number} permission`
            : `${number} permissions`
            );
}