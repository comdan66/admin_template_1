/**
 * @author      OA Wu <comdan66@gmail.com>
 * @copyright   Copyright (c) 2016 OA Wu Design
 */
 
$(function () {
  $('.count-up').each (function () {
    new CountUp ($(this).get (0), 0, $(this).text (), 0, 2, { useEasing: true, useGrouping: true, separator: ',', decimal: '.', prefix: '', suffix: '' }).start ();
  });
});
