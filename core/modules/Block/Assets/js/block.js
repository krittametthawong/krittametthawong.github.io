$(function () {
    $(document).delegate('.block .fa-edit', 'click', function (evt) {
        evt.preventDefault();
        const $this = $(this).closest('.block');
        $.ajax({
            url: $(this).data('link_edit'),
            type: 'GET',
            dataType: 'html',
            success: function (data) {
                $this.replaceWith(data);
                addEditor();
            }
        });
    }).delegate('.block .fa-trash-alt', 'click', function (evt) {
        evt.preventDefault();
        const $block = $(this).closest('.block');
        if (confirm("Voulez vous supprimer définitivement le contenu ?")) {
            $.ajax({
                url: $(this).data('link_delete'),
                type: 'DELETE',
                dataType: 'html',
                success: function (data) {
                    $block.replaceWith('');
                }
            });
        }
    }).delegate('.block-edit input[name=submit_save]', 'click', function (evt) {
        evt.preventDefault();
        const $this = $(this);
        const $form = $this.parent('form');
        $.ajax({
            url: $form.attr('action'),
            type: $form.attr('method'),
            data: $form.serialize(),
            dataType: 'html',
            success: function (data) {
                $this.closest('.block-edit').replaceWith(data);
            }
        });
    }).delegate('.block-edit input[name=submit_cancel]', 'click', function (evt) {
        evt.preventDefault();
        const $block = $(this).closest('.block-edit');
        $.ajax({
            url: $block.data('link_show'),
            type: 'GET',
            dataType: 'html',
            success: function (data) {
                $block.replaceWith(data);
            }
        });
    });
    $('.block-create').click(function (evt) {
        evt.preventDefault();
        $.ajax({
            url: $(this).data('link_create'),
            type: 'GET',
            dataType: 'html',
            success: function (data) {
                $('#modal_block .modal-body').replaceWith(data);
            }
        });
    });
});

function sortSection(evt, target)
{
    let weight = 0;

    $(evt.to).find('.block').each(function () {
        $.ajax({
            url: $(this).find('.fa-arrows-alt').data('link_update'),
            type: 'POST',
            data: `weight=${weight}&section=${$(evt.to).data('id')}`
        });
        weight++;
    });
}

function search_blocks() {
    const search = document.getElementById('search').value;
    const reg = new RegExp(search, 'i');
    const elements = document.querySelectorAll('.search_item');

    Array.prototype.forEach.call(elements, function (el) {
        el.style.display = '';
        const searchEl = el.querySelector('.search_text');

        if (reg.test(searchEl.textContent)) {
            const str = strHighlight(search, searchEl.textContent);
            searchEl.innerHTML = str;
        } else {
            el.style.display = 'none';
        }
    });
}