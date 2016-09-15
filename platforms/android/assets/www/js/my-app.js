// Initialize your app
var myApp = new Framework7({
    upscroller: {text : 'Yukarı'},
    domCache: true,
    template7Pages: true,
    swipePanel: 'left'
});
// Export selectors engine
var $$ = Dom7;


var mainView = myApp.addView('.view-main', {
    dynamicNavbar: true
});


window.localStorage.setItem('page',1);


$(document).on('click','.tab-link',function(){
    var id = $(this).attr('id');

    if(id === 'icerik-detay-page') {
      var icerik_id = $(this).attr('data-detay-id');
      // alert(icerik_id);
      $.each(yazilar, function(index,val) {
        if(val.link == icerik_id) {
          // alert('biz bize benzeriz :)');
          $('.detay-baslik').html(val.title);
          $('.detay-icerik').html(val.content);
          $('img').height('auto');
          $('img').width('100%');
          var foto = $('.detay-icerik img');

          $.each(foto, function(index, value) {
            console.log($(value).attr('src'));
            $(value).attr( "data-href", $(value).attr('src') );

          })
        }
      });

    }
    if(id === 'etkinlik-detay-page') {
      var etkinlik_id = $(this).attr('data-etkinlik-id');
      alert(etkinlik_id);

      $.each(etkinlikler, function(index, val) {
        if(val.id == etkinlik_id) {
          $('.etkinlik-baslik').html(val.baslik);
          $('.etkinlik-icerik').html(val.icerik);
          $('.etkinlik-tarih').html(val.yapilacakTarih);
          $('.etkinlik-saat').html(val.yapilacakSaat);
          $('.etkinlik-yer').html(val.yapilacakYer);
        }
      })

    }

    window.localStorage.setItem('page',id);

});

$(document).on('click', '.detay-icerik img', function() {
  var ref = cordova.InAppBrowser.open($(this).attr('data-href'), '_self');
})

$(document).on('click', '.sosyal-medya', function() {
  var ref = cordova.InAppBrowser.open($(this).attr('data-href'), '_system');
})

$(document).on('click','.icerik-detay-back',function() {
  $('.icerik-back').addClass('active');
  $('.detay-baslik').html('');
  $('.detay-icerik').html('');
})

$(document).on('click','.etkinlik-detay-back',function() {
  $('.etkinlik-back').addClass('active');
})


// localStorage keywords
var yazilar;
var etkinlikler;


var lastIndex;

$( document ).ready(function() {

    myApp.showIndicator();

  $.ajax({
    url      : 'https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&callback=?&q=' + encodeURIComponent('https://canyoupwn.me/feed'),
    dataType : 'json',
    success  : function (data) {
      navigator.splashscreen.hide();
      myApp.hideIndicator();

      // $('.yukleniyor-yazilar').css('display','none');
      // console.log(data);
      if (data.responseData.feed && data.responseData.feed.entries) {
        yazilar = data.responseData.feed.entries;
        $.each(data.responseData.feed.entries, function (i, e) {
          $('#blogIcerik').append(''+
            '<div class="card demo-card-header-pic" id="blog-icerik-"'+e.link+'>'+
              '<div valign="bottom"style="background-color:#Ffc000;" class="card-header color-white no-border">'+e.title+'</div>'+
                  '<div class="card-content">'+
                      '<div class="card-content-inner">'+
                          '<p class="color-gray">Posted on '+e.publishedDate+'</p>'+
                          '<p>'+e.contentSnippet+'</p>'+
                      '</div>'+
                  '</div> '+
               '<div class="card-footer"> '+
                  '<a href="#" class="link paylas" data-link="'+e.link+'" data-baslik="'+e.title+'">Paylaş</a>'+
                  '<a href="#icerik-detay" id="icerik-detay-page" data-detay-id="'+e.link+'" class="tab-link active item-link item-content detay-id">Devamını oku</a>'+
              '</div>'+
            '</div>');
        });
        // lastIndex = $(data.responseData.feed.entries).length;
        // alert(lastIndex);


      }else {
        alert('Error :(');
      }
    },
      error: function (xhr, ajaxOptions, thrownError) {
        console.log(xhr);
        console.log(thrownError);
      }
  });

  //  ### Markdown parse örnegi ###
  // $.ajax({
  //   url      : 'https://raw.githubusercontent.com/barisesen/test/master/README.md',
  //   success  : function (data) {
  //     // console.log(data);
  //     var mark = data.replace(/\r/g, "").replace(/\n/g, "");
  //
  //     //  var mark = data;
  //      console.log(mark);
  //      markdownToHtml(mark, function(v) {
  //        console.log(v);
  //      })
  //   }
  // })
  //  ### Markdown parse örnegi ###


  $.ajax({
    url      : 'https://raw.githubusercontent.com/barisesen/test-ghp/master/etkinlik.json?token=AOqnrifUAtpRVy2wWfR3H-2E4pSUAslDks5X494ewA%3D%3D',
    dataType : 'json',
    success  : function (data) {
      // alert(data.etkinlikler[0].baslik)
      // data = JSON.parse(data);
      // console.log(data);
      if(data.etkinlikler) {
        etkinlikler = data.etkinlikler;
        $.each(data.etkinlikler, function(index, value) {
          $('.etkinlik-liste').append('<li>'+
          '<a href="#etkinlik-detay" class="item-link item-content tab-link" id="etkinlik-detay-page" data-etkinlik-id="'+value.id+'">'+
          '<div class="item-inner">'+
          '<div class="item-title-row">'+
          '<div class="item-title">'+value.baslik+'</div>'+
          '<div class="item-after">'+value.yapilacakTarih+'</div>'+
          '</div>'+
          '<div class="item-subtitle">'+value.yapilacakYer+'</div>'+
          '<div class="item-text">'+value.kisaIcerik+'</div>'+
          '</div>'+
          '</a>'+
          '</li>');
        });

      } else {
        alert('Bir hata oluştu :(')
      }
    }
  })

/**** Markadown to html kullanımı *******/
  // markdownToHtml('', function(html) {
  //   console.log(html);
  //   alert(html)
  // });

});

$(document).on('click','.paylas', function () {
    var message = {
        text: $(this).attr('data-baslik')+" - Pausiber aracılığı ile paylaşıldı. ",
        url: $(this).attr('data-link')
    };
    window.socialmessage.send(message);
});

// Loading flag
// var loading = false;
//
// // Last loaded index
// // var lastIndex = $$('.anasayfa-scroll').length;
//
// // Max items to load
// var maxItems = 60;
//
// // Append items per load
// var itemsPerLoad = 10;
//
// // Attach 'infinite' event handler
// $$('.infinite-scroll').on('infinite', function () {
//
//     // Exit, if loading in progress
//     if (loading) return;
//
//     // Set loading flag
//     loading = true;
//
//     // Emulate 1s loading
//     setTimeout(function () {
//         // Reset loading flag
//         loading = false;
//
//         if (lastIndex >= maxItems) {
//             // Nothing more to load, detach infinite scroll events to prevent unnecessary loadings
//             myApp.detachInfiniteScroll($$('.infinite-scroll'));
//             // Remove preloader
//             $$('.infinite-scroll-preloader').remove();
//             return;
//         }
//
//         $.ajax({
//           url      : 'https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&callback=?&q=' + encodeURIComponent('https://canyoupwn.me/page/2/feed'),
//           dataType : 'json',
//           success  : function (data) {
//             console.log(data);
//             if (data.responseData.feed && data.responseData.feed.entries) {
//               // yazilar = data.responseData.feed.entries;
//               $.each(data.responseData.feed.entries, function (i, e) {
//                 $('#blogIcerik').append(''+
//                   '<div class="card demo-card-header-pic anasayfa-scroll" id="blog-icerik-"'+e.link+'>'+
//                     '<div style="background-image:url(https://pbs.twimg.com/profile_banners/762376797635960833/1471388019/1500x500)" valign="bottom" class="card-header color-white no-border">'+e.title+'</div>'+
//                         '<div class="card-content">'+
//                             '<div class="card-content-inner">'+
//                                 '<p class="color-gray">Posted on '+e.publishedDate+'</p>'+
//                                 '<p>'+e.contentSnippet+'</p>'+
//                             '</div>'+
//                         '</div> '+
//                      '<div class="card-footer"> '+
//                         '<a href="#" class="link">Like</a>'+
//                         '<a href="#icerik-detay" id="icerik-detay-page" data-detay-id="'+e.link+'" class="tab-link active item-link item-content detay-id">Read more</a>'+
//                     '</div>'+
//                   '</div>');
//               });
//               // Update last loaded index
//               lastIndex += $(data.responseData.feed.entries).length;
//             }else {
//               alert('Error :(');
//             }
//           },
//             error: function (xhr, ajaxOptions, thrownError) {
//               alert(xhr);
//               alert(thrownError);
//             }
//         });
//
//         // Generate new items HTML
//         // var html = '';
//         // for (var i = lastIndex + 1; i <= lastIndex + itemsPerLoad; i++) {
//         //     html += '' +
//         //         '<li class="accordion-item"> <a href="#" class="item-content item-link"> <div class="item-media"> <span class="fa fa-smile-o fa-2x color-green"></span> </div> <div class="item-inner" > <div class="item-title-row"> <div class="item-title ">Gelir</div> <div class="item-after" > 15₺ </div> </div> <div class="item-subtitle"><span class="fa fa-credit-card" style="margin-right: 30px;"></span></div> </div> </a> <div class="accordion-item-content"> <div class="content-block"> <p>Babam sağolsun.. </p> </div> </div> </li>' +
//         //         '';
//         // }
//
//         // Append new items
//         // $$('.anasayfa').append(html);
//
//
//     }, 1000);
// });
// Pull to refresh content

var ptrContent = $('.pull-to-refresh-content');

// Add 'refresh' listener on it
ptrContent.on('refresh', function (e) {
    // Emulate 2s loading
    setTimeout(function () {


        var yazi = '';
        if (window.localStorage.getItem('page') == 1)
        {
          $.ajax({
            url      : 'https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&callback=?&q=' + encodeURIComponent('https://canyoupwn.me/feed'),
            dataType : 'json',
            success  : function (data) {

              // $('.yukleniyor-yazilar').css('display','none');
              // console.log(data);
              if (data.responseData.feed && data.responseData.feed.entries) {
                $('#blogIcerik').html('');
                yazilar = data.responseData.feed.entries;
                $.each(data.responseData.feed.entries, function (i, e) {
                  $('#blogIcerik').append(''+
                    '<div class="card demo-card-header-pic" id="blog-icerik-"'+e.link+'>'+
                      '<div style="background-image:url(https://pbs.twimg.com/profile_banners/762376797635960833/1471388019/1500x500)" valign="bottom" class="card-header color-white no-border">'+e.title+'</div>'+
                          '<div class="card-content">'+
                              '<div class="card-content-inner">'+
                                  '<p class="color-gray">Posted on '+e.publishedDate+'</p>'+
                                  '<p>'+e.contentSnippet+'</p>'+
                              '</div>'+
                          '</div> '+
                       '<div class="card-footer"> '+
                          '<a href="#" class="link paylas" data-link="'+e.link+'" data-baslik="'+e.title+'">Paylaş</a>'+
                          '<a href="#icerik-detay" id="icerik-detay-page" data-detay-id="'+e.link+'" class="tab-link active item-link item-content detay-id">Devamını oku</a>'+
                      '</div>'+
                    '</div>');
                });
                // lastIndex = $(data.responseData.feed.entries).length;
                // alert(lastIndex);


              }else {
                alert('Error :(');
              }
            },
              error: function (xhr, ajaxOptions, thrownError) {
                console.log(xhr);
                console.log(thrownError);
              }
          });

            yazi = "Blog yazıları güncellendi";

        }
        if (window.localStorage.getItem('page') == 3)
        {
          $.ajax({
            url      : 'https://barisesen.github.io/test-ghp/etkinlik.json',
            dataType : 'json',
            success  : function (data) {
              // alert(data.etkinlikler[0].baslik)
              // data = JSON.parse(data);
              // console.log(data);
              if(data.etkinlikler) {
                $('.etkinlik-liste').html('');
                $.each(data.etkinlikler, function(index, value) {
                  $('.etkinlik-liste').append('<li>'+
                  '<a href="#" class="item-link item-content">'+
                  '<div class="item-inner">'+
                  '<div class="item-title-row">'+
                  '<div class="item-title">'+value.baslik+'</div>'+
                  '<div class="item-after">'+value.yapilacakTarih+'</div>'+
                  '</div>'+
                  '<div class="item-subtitle">'+value.yapilacakYer+'</div>'+
                  '<div class="item-text">'+value.kisaIcerik+'</div>'+
                  '</div>'+
                  '</a>'+
                  '</li>');
                });

              } else {
                alert('Bir hata oluştu :(')
              }
            }
          })


            yazi =  "Etkinlik listesi güncellendi" ;
        }

        myApp.addNotification({
            title: 'Pausiber.xyz',
            message: yazi,
            onClose: function () {
                console.log('Notification closed');
            }
        });

        myApp.pullToRefreshDone();
    }, 1000);
});
