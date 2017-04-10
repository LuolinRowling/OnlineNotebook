$(document).ready(function() {
    $('.js-username').blur(function(e) {     
        validateUsername($(this).val());      
    });

    $('.js-register .js-password').blur(function(e) {
        validatePassword($(this).val());
    });

    $('.js-register .js-repeatPassword').blur(function(e) {
        validateRepeatPassword($('.js-password').val(), $(this).val());
    })

    $('.js-register .js-submit').on('click', function(e) {
        var usernameFlag = validateUsername($('.js-username').val()),
            passwordFlag = validatePassword($('.js-register .js-password').val()),
            repeatPasswordFlag = validateRepeatPassword($('.js-register .js-password').val(), $('.js-register .js-repeatPassword').val());
        
        if (usernameFlag && passwordFlag && repeatPasswordFlag) {
            $('#register-form')[0].submit();
            return true;
        } else {
            console.log('return false;')
            return false;
        }
    });

    function validateUsername(username) {
        var reg = /^[a-zA-Z0-9\_]*$/,
            alertBlock = $('.js-username-alert');

        if (username.trim().length === 0) {
            alertBlock.html('请输入用户名');
            alertBlock.show();   
            return false;
        }

        if (reg.test(username)) {
            if (username.length > 20 || username.length < 3) {
                alertBlock.html('用户名长度应在 3 - 20 个字符');
                alertBlock.show();   
                return false;            
            } else {
                alertBlock.hide();
                return true;
            }
        } else {
            alertBlock.html('用户名包含非法字符（仅能使用数字、字母、下划线）');
            alertBlock.show();
            return false;
        }
    }
    
    function validatePassword(password) {
        var alertBlock = $('.js-password-alert'),
            reg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

        if (password.trim().length === 0) {
            alertBlock.html('请输入密码');
            alertBlock.show();   
            return false;            
        }
        if (reg.test(password)) {
            alertBlock.hide();
            return true;
        } else {
            alertBlock.html("长度不能少于6，必须同时包含数字、小写字母、大写字母");
            alertBlock.show();
            return false;
        }
    }

    function validateRepeatPassword(password, repeatPassword) {
        var alertBlock = $('.js-repeatpassword-alert');

        if (repeatPassword.trim().length === 0) {
            alertBlock.html('请再次输入密码');
            alertBlock.show();   
            return false;             
        }

        if (password !== repeatPassword) {
            alertBlock.html('两次填写的密码不一致');
            alertBlock.show();
            return false;
        } else {
            alertBlock.hide();
            return true;
        }
    }
});


