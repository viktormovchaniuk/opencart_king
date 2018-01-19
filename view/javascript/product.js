$(document).ready(function() {
  var urlString = window.location.href;
  var siteUrl = new URL(urlString);
  var id = siteUrl.searchParams.get('product_id');


  $('.product__item-img').magnificPopup({
    type:'image',
    delegate: 'a',
    gallery: {
      enabled: true
    },
    image: {
      cursor: null
    }  
  });




  $('select[name=\'recurring_id\'], input[name="quantity"]').change(function(){
    $.ajax({
      url: 'index.php?route=product/product/getRecurringDescription',
      type: 'post',
      data: $('input[name=\'product_id\'], input[name=\'quantity\'], select[name=\'recurring_id\']'),
      dataType: 'json',
      beforeSend: function() {
        $('#recurring-description').html('');
      },
      success: function(json) {
        $('.alert-dismissible, .text-danger').remove();

        if (json['success']) {
          $('#recurring-description').html(json['success']);
        }
      }
    });
  });

  $('#button-cart').on('click', function() {
    $.ajax({
      url: 'index.php?route=checkout/cart/add',
      type: 'post',
      data: $('#product input[type=\'text\'], #product input[type=\'number\'], #product input[type=\'hidden\'], #product input[type=\'radio\']:checked, #product input[type=\'checkbox\']:checked, #product select, #product textarea'),
      dataType: 'json',
      beforeSend: function() {
        $('#button-cart').button('loading');
        $('#cart .cart-btn-counter').removeClass('add');
        $('#cart-total span').removeClass('add');
      },
      complete: function() {
        $('#button-cart').button('reset');
      },
      success: function(json) {
        $('.alert-dismissible, .text-danger').remove();
        $('.form-group').removeClass('has-error');

        if (json['error']) {
          if (json['error']['option']) {
            for (i in json['error']['option']) {
              var element = $('#input-option' + i.replace('_', '-'));

              if (element.parent().hasClass('input-group')) {
                element.parent().after('<div class="text-danger">' + json['error']['option'][i] + '</div>');
              } else {
                element.after('<div class="text-danger">' + json['error']['option'][i] + '</div>');
              }
            }
          }

          if (json['error']['recurring']) {
            $('select[name=\'recurring_id\']').after('<div class="text-danger">' + json['error']['recurring'] + '</div>');
          }

          $('.text-danger').parent().addClass('has-error');
        }

        if (json['success']) {

          $('#cart .cart-btn-counter').addClass('add');
          $('#cart-total span').addClass('add');

          $('#cart > ul').load('index.php?route=common/cart/info ul li');

          setTimeout(function () {

            $('#cart-total span').html(json['total'].match(/\d+/)[0]);
            $('#cart .cart-btn-counter').html(json['total'].match(/\d+/)[0]);
            $('#cart-total').attr('title', json['total']);
            $('#cart-mobile').html('Корзина (' + json['total'].match(/\d+/)[0] +')');
          }, 100);
        }
      },
      error: function(xhr, ajaxOptions, thrownError) {
        alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
      }
    });
  });

  $('#review').load('index.php?route=product/product/review&product_id=' + id, function() {
    var carouselComment = new Swiper('.swiper-container2', {
      mode: 'horizontal',
      slidesPerView: 3,
      pagination: false,
      paginationClickable: false,
      nextButton: '.swiper-button-next--comment',
      prevButton: '.swiper-button-prev--comment',
      autoplay: false,
      loop: false,
      autoHeight: true,
      breakpoints: {
        900: {
          slidesPerView: 2,
        },
        600: {
          slidesPerView: 1

        }
      }
    });
  });

  $('#button-review').on('click', function() {
    $.ajax({
      url: 'index.php?route=product/product/write&product_id=' + id,
      type: 'post',
      dataType: 'json',
      data: $("#form-review").serialize(),
      beforeSend: function() {
        $('#button-review').button('loading');
      },
      complete: function() {
        $('#button-review').button('reset');
      },
      success: function(json) {
        $('.alert-dismissible').remove();

        if (json['error']) {
          $('#review').after('<div class="alert alert-danger alert-dismissible"><i class="fa fa-exclamation-circle"></i> ' + json['error'] + '</div>');
        }

        if (json['success']) {
          $('#review').after('<div class="alert alert-success alert-dismissible"><i class="fa fa-check-circle"></i> ' + json['success'] + '</div>');

          $('input[name=\'name\']').val('');
          $('textarea[name=\'text\']').val('');
          $('input[name=\'rating\']:checked').prop('checked', false);
        }
      }
    });
  });


  (function () {

  	var totalPrice = $('.product__sum-value');
    var itemPrice = +$('.product__price').html().match(/\d+/)[0];

    totalPrice.html('от ' + $('#item-quantity').val() * itemPrice +' грн.');

 $('#item-quantity').change(function() {
    totalPrice.html('от ' + this.value * itemPrice +' грн.');

 });


    var carouselSameProduct = new Swiper('.swiper-container1', {
      mode: 'horizontal',
      slidesPerView: 3,
      pagination: false,
      paginationClickable: false,
      nextButton: '.swiper-button-next--same',
      prevButton: '.swiper-button-prev--same',
      autoplay: false,
      loop: false,
      autoHeight: true,
      spaceBetween: 20,
      breakpoints: {
        900: {
          slidesPerView: 2,
        },
        600: {
          slidesPerView: 1
        }
      }
    });

    var ratingContainer = $('#comment-rating');
    var ratingMark = $('.rating__mark');

    $('#comment-rating').children('input[type="radio"]').click(function() {
      var rating = $('#comment-rating input:checked').val() + '.0';
      ratingMark.html(rating);
    });



    var slides = document.getElementsByClassName("product__item-slide");
    var dots = document.getElementsByClassName("product__slide-img");
    var arr = [].slice.call(dots);

    for (i = 0; i < arr.length; i++) {
      arr[i].addEventListener('click', function currentSlide() {
        showSlides(slideIndex = arr.indexOf(this) + 1);
      });
    }

    function showSlides(n) {
      var i;
      if (n > slides.length) {slideIndex = 1}
        if (n < 1) {slideIndex = slides.length}
          for (i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
          }
          for (i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(" active", "");
          }
          slides[slideIndex-1].style.display = "block";
          dots[slideIndex-1].className += " active";

        }
      })();


    });


