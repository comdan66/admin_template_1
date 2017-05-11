/**
 * @author      OA Wu <comdan66@gmail.com>
 * @copyright   Copyright (c) 2016 OA Wu Design
 */

$(function () {
  $('textarea.cke').ckeditor ({
    filebrowserUploadUrl: '1',
    filebrowserImageBrowseUrl: '1',
    skin: 'oa',
    height: 300,
    resize_enabled: false,
    removePlugins: 'elementspath',
    toolbarGroups: [{ name: '1', groups: [ 'mode', 'tools', 'links', 'basicstyles', 'colors', 'insert', 'list' ] }],
    removeButtons: 'Strike,Underline,Italic,Table,HorizontalRule,Smiley,Subscript,Superscript,Forms,Save,NewPage,Print,Preview,Templates,Cut,Copy,Paste,PasteText,PasteFromWord,Find,Replace,SelectAll,Scayt,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,Form,RemoveFormat,CreateDiv,BidiLtr,BidiRtl,Language,Anchor,Flash,PageBreak,Iframe,About,Styles'
  });

  $('.drop_img').OAdropUploadImg ();

  function mutiImg ($obj) {
    if ($obj.length <= 0) return;
    $obj.on ('click', '.drop_img > a', function () {
      var $parent = $(this).parent ();
      $parent.remove ();
    });

    $obj.on ('change', '.drop_img > input[type="file"]', function () {
      if (!$(this).val ().length) return;
      var $parent = $(this).parent (),
          $n = $parent.clone ().removeAttr ('data-loading').addClass ('no');

      $n.find ('img').attr ('src', '');
      $n.find ('input').val ('');
      $n.OAdropUploadImg ().insertAfter ($parent);
    });
  }
  mutiImg ($('.drop_imgs'));
});