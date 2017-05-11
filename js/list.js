/**
 * @author      OA Wu <comdan66@gmail.com>
 * @copyright   Copyright (c) 2016 OA Wu Design
 */
$(function () {
  $('.table-list').each (function () { if (!$(this).find ('tbody > tr').length) $(this).find ('tbody').append ($('<tr />').append ($('<td />').attr ('colspan', $(this).find ('thead th').length).text ('沒有任何資料。'))); });
});
