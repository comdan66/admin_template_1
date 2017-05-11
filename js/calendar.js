/**
 * @author      OA Wu <comdan66@gmail.com>
 * @copyright   Copyright (c) 2016 OA Wu Design
 */

$(function () {
  var _weeks = ['日', '一', '二', '三', '四', '五', '六'];

  var _gan = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
  var _zhi = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
  var _animals = ['鼠','牛','虎','兔','龍','蛇','馬','羊','猴','雞','狗','豬'];
  
  function lunarYear (y) { return y - 1911; }
  function animals (y) { return _animals[(y - 4) % 12]; }
  function ganZhi (n) { n = n - 1900 + 36; return _gan[n % 10] + _zhi[n % 12]; }

  function monthDayCount (y, m) {
    m = parseInt (m, 10);
    y = parseInt (y, 10);
    
    return (--m == 1) ? ((y % 4) === 0) && ((y % 100) !== 0) || ((y % 400) === 0) ? 29 : 28 : [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m];
  }
  function prevMonth (y, m) {
    m = isNaN (y) ? y.m : parseInt (m, 10);
    y = isNaN (y) ? y.y : parseInt (y, 10);

    return { y: m == 1 ? y - 1 : y, m: m == 1 ? 12 : (m - 1), c: monthDayCount (y, m == 1 ? 12 : (m - 1)) };
  }
  function nextMonth (y, m) {
    m = isNaN (y) ? y.m : parseInt (m, 10);
    y = isNaN (y) ? y.y : parseInt (y, 10);
    return { y: m == 12 ? y + 1 : y, m: m == 12 ? 1 : (m + 1) };
  }
  function createMonth (y, m) {
    m = isNaN (y) ? y.m : parseInt (m, 10);
    y = isNaN (y) ? y.y : parseInt (y, 10);

    var firstDayWeek = new Date(y, m - 1, 1).getDay ();
    var monthCount = monthDayCount (y, m);
    var weekCount = parseInt ((firstDayWeek + monthCount) / 7, 10) + (((firstDayWeek + monthCount) % 7) ? 1 : 0);
    var prev = prevMonth (y, m);
    var next = nextMonth (y, m);
    var time = new Date ();

    return Array.apply (null, Array (weekCount)).map (function (_, i) {
      return Array.apply (null, Array (7)).map (function (_, j) {
        var d = i * 7 + j - firstDayWeek + 1;

        var r = {
          y: d > 0 ? d > monthCount ? next.y : y : prev.y,
          m: d > 0 ? d > monthCount ? next.m : m : prev.m,
          d: (d > 0 ? d > monthCount ? -monthCount : 0 : prev.c) + d,
        };
        
        var lun = window.LunarCalendar.solarToLunar (r.y, r.m, r.d);
        
        
        return {
          y: r.y,
          m: r.m,
          d: r.d,
          t: r.y == time.getFullYear () && r.m == time.getMonth () + 1 && r.d == time.getDate (),
          l: lun.lunarDay == 1 ? lun.lunarMonthName : lun.lunarDayName,
          nl: lun.lunarDay == 1,
          h: lun.worktime,
          f: (lun.term ? [lun.term] : []).concat (lun.solarFestival.concat (lun.lunarFestival))
        };
      });
    });
  }

  function initMonth (y, m) {
    m = isNaN (y) ? y.m : parseInt (m, 10);
    y = isNaN (y) ? y.y : parseInt (y, 10);

    return $('<div />').addClass ('month').append (
      $('<div />').addClass ('weeks').append (
        _weeks.map (function (i) {
          return $('<div />').text (i);
        }))).append (
      createMonth (y, m).map (function (i) {
        return $('<div />').addClass ('days').append (i.map (function (j) {
          return $('<div />').addClass (!(j.y == y && j.m == m) ? 'not-this-month' : null)
                             .addClass (j.t ? 'today' : null)
                             .addClass (j.nl ? 'new-lunar' : null)
                             .addClass (j.h ? 'holiday' : null)
                             .attr ('data-y', j.y)
                             .attr ('data-m', j.m)
                             .attr ('data-d', j.d)
                             .attr ('data-l', j.l).append (
                  j.f.length ? $('<span />').text (j.f.join (', ')) : null);
        }));
      }));
  }
  function resetMonth ($obj, y, m) {
    m = isNaN (y) ? y.m : parseInt (m, 10);
    y = isNaN (y) ? y.y : parseInt (y, 10);

    var prev = prevMonth (y, m),
        next = nextMonth (y, m);

    return $obj.empty ()
               .append (initMonth (prev))
               .append (initMonth (y, m))
               .append (initMonth (next));
  }
  $('.calendar').each (function () {
    var $that = $(this),
        time = new Date ();
        
    var $now = $that.find ('.now')
                    .attr ('data-y', time.getFullYear ())
                    .attr ('data-m', time.getMonth () + 1)
                    .attr ('data-l', lunarYear (time.getFullYear ()))
                    .attr ('data-gz', ganZhi (time.getFullYear ()))
                    .attr ('data-a', animals (time.getFullYear ()));


    var $months = resetMonth ($that.find ('.months'), $now.data ('y'), $now.data ('m'));
                
    $that.find ('.arr a')
         .click (function () {
            var o = {};

            if ($(this).index () === 0) {
              var time = new Date ();
              o = {y: time.getFullYear (), m: time.getMonth () + 1};
              resetMonth ($months, o);
            } else if ($(this).index () == 1) {
              o = prevMonth ($now.attr ('data-y'), $now.attr ('data-m'));
              $months.prepend (initMonth (prevMonth (o)));
              $months.find ('.month').last ().remove ();
            } else if ($(this).index () == 2) {
              o = nextMonth ($now.attr ('data-y'), $now.attr ('data-m'));
              $months.append (initMonth (nextMonth (o)));
              $months.find ('.month').first ().remove ();
            }

            $now.attr ('data-y', o.y)
                .attr ('data-m', o.m)
                .attr ('data-l', lunarYear (o.y))
                .attr ('data-gz', ganZhi (o.y))
                .attr ('data-a', animals (o.y));
         });
  });

});