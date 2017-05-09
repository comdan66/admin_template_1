/**
 * @author      OA Wu <comdan66@gmail.com>
 * @copyright   Copyright (c) 2016 OA Wu Design
 */

(function( factory ) { if ((typeof define === 'function') && define.amd) define (['jquery'], factory); else factory (jQuery); }(function ($) {
  $.fn.extend ({
    OAdropUploadImg: function (opt) {
      var d4Opt = {
      },
      loading = function ($img) {
        clean ($img);
        $(this).attr ('data-loading', '讀取中..').removeClass ('no');
      },
      clean = function ($img, noImg) {
        $(this).removeAttr ('data-loading').addClass ('no');
        if ($img && noImg !== true) $img.attr ('src', '');
      },
      rotate = function (e, callback, a) {
        var img = new Image ();
        img.src = e.target.result;
        img.onload = function () {
          _vmxw = 1024;
          var ca = document.createElement ('canvas');

          if (a == 6 || a == 8) { ca.height = img.width; ca.width = img.height; } else { ca.width = img.width; ca.height = img.height; }
          if (Math.max (ca.width, ca.height) > _vmxw) { if (ca.width > ca.height) { ca.height = (_vmxw / ca.width) * ca.height; ca.width = _vmxw; } else { ca.width = (_vmxw / ca.height) * ca.width; ca.height = _vmxw; } }
          
          if (a == 3) {
            ca.getContext ('2d').transform (-1, 0, 0, -1, ca.width, ca.height);
            ca.getContext ('2d').drawImage (img, 0, 0, ca.width, ca.height);
          } else if (a == 6) {
            ca.getContext ('2d').transform (0, 1, -1, 0, ca.width, 0);
            ca.getContext ('2d').drawImage (img, 0, 0, ca.height, ca.width);
          } else if (a == 8) {
            ca.getContext ('2d').transform (0, -1, 1, 0, 0, ca.height);
            ca.getContext ('2d').drawImage (img, 0, 0, ca.height, ca.width);
          } else {
            ca.getContext ('2d').drawImage (img, 0, 0, ca.width, ca.height);
          }
          callback (ca);
        };
      },
      rotateAngle = function (file, callback) {
        var reader = new FileReader ();

        reader.onload = function (e) {
          var view = new DataView (e.target.result);

          if (view.getUint16 (0, false) != 0xFFD8)
            return rotate (this, callback, -2);

          var length = view.byteLength, offset = 2;

          while (offset < length) {
            var marker = view.getUint16 (offset, false);
            offset += 2;

            if (marker == 0xFFE1) {
              if (view.getUint32 (offset += 2, false) != 0x45786966)
                return rotate (this, callback, -1);

              var little = view.getUint16 (offset += 6, false) == 0x4949;
              offset += view.getUint32 (offset + 4, little);

              var tags = view.getUint16 (offset, little);
              offset += 2;

              for (var i = 0; i < tags; i++)
                if (view.getUint16 (offset + (i * 12), little) == 0x0112)
                  return rotate (this, callback, view.getUint16 (offset + (i * 12) + 8, little));

            } else if ((marker & 0xFF00) != 0xFF00) {
              break;
            }
            else {
              offset += view.getUint16 (offset, false);
            }
          }

          return rotate (this, callback, -1);
        }.bind (this);

        reader.readAsArrayBuffer (file.slice (0, 64 * 1024));
      },
      loadPic = function ($img, file) {
        var $obj = $(this);
        var reader = new FileReader ();

        reader.onload = function (e) {
          rotateAngle.bind (e, file, function (ca) {
            $img.attr ('src', ca.toDataURL ()).load (clean.bind ($obj, $img, true));
          }) ();
        };

        reader.readAsDataURL (file);
      },
      init = function (opt) {
        
        var $obj = $(this),
            $img = $obj.find ('img'),
            $input = $obj.find ('input[type="file"]').change (function () {

              loading.bind ($obj, $img) ();

              if (!($(this).val ().length && $(this).get (0).files && $(this).get (0).files[0]))
                clean.bind ($obj, $img, false) ();
              else
                loadPic.bind ($obj, $img, $(this).get (0).files[0]) ();

              $(this).css ({'top' : 0, 'left': 0});
            });

        $obj.bind ('dragover', function (e) {
          e.stopPropagation ();
          e.preventDefault ();
          $(this).addClass ('no');
          $input.offset ({ top: e.originalEvent.pageY - 15, left: e.originalEvent.pageX - 100 });
        })
        .bind ('dragleave', function (e) { e.stopPropagation (); e.preventDefault (); });
      };

      $(this).each (init.bind ($(this), $.extend (true, d4Opt, opt)));
      return $(this);
    }
  });
}));