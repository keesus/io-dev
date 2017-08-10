/**
 * Created by 1001188 on 2016. 4. 25..
 */


module.exports = function (grunt) {

    grunt.initConfig({
        pkg:grunt.file.readJSON('package.json'),
        "clean": {
            options: {
                force: true
            },
            build: ["build"]
        },
        uglify : {
           my_target : {
               files : {
                   'build/js/config.js':['build/js/config.js'],
                   'build/js/main.js':['build/js/main.js'],
                   'build/js/terms.js':['build/js/terms.js'],
                   'build/js/channel.js':['build/js/channel.js'],
                   'build/js/pay/card.js':['build/js/pay/card.js'],
                   'build/js/pay/complete.js':['build/js/pay/complete.js'],
                   'build/js/pay/device.js':['build/js/pay/device.js'],
                   'build/js/pay/free.js':['build/js/pay/free.js'],
                   'build/js/pay/plan.js':['build/js/pay/plan.js'],
                   'build/js/pay/user.js':['build/js/pay/user.js']
               }
           }
        },
        copy : {
            main : {
                files : [
                    {expand : true, src:['index.html'],dest:'build/'},
                    {expand : true, src:['terms.html'],dest:'build/'},
                    {expand : true, src:['img/**'], dest:'build/'},
                    {expand : true, src:['css/**'], dest:'build/'},
                    {expand : true, src:['pay/**'], dest:'build/'},
                    {expand : true, src:['js/plugins.js'], dest:'build/'},
                    {expand : true, src:['bower_components/**'], dest:'build/'},
                    {expand : true, src:['js/vendor/**'], dest:'build/'}
                ]
            },
            member : {
                files : [
                    {expand : true, src:['index.html'],dest:'qa/'},
                    {expand : true, src:['terms.html'],dest:'qa/'},
                    {expand : true, src:['img/**'], dest:'qa/'},
                    {expand : true, src:['css/**'], dest:'qa/'},
                    {expand : true, src:['pay/**'], dest:'qa/'},
                    {expand : true, src:['js/plugins.js'], dest:'qa/'},
                    {expand : true, src:['bower_components/**'], dest:'qa/'},
                    {expand : true, src:['js/vendor/**'], dest:'qa/'}
                ]
            }
        },
        replace : {
            live_host: {
                src:["js/main.js","js/terms.js", "js/config.js", "js/channel.js"],
                replacements:[{
                    from:"http://localhost/event",
                    to:"https://switcher.kr/event"
                }],
                dest:'build/js/'
            },
            live_pay_host: {
                src:["js/pay/*.js"],
                replacements:[{
                    from:"http://localhost/event",
                    to:"https://switcher.kr/event"
                }],
                dest:'build/js/pay/'
            },
            member_eventInfo_path : {
                src:["js/main.js","js/terms.js"],
                replacements:[{
                    from:"/eventInfo",
                    to:"/member/eventInfo"
                },
                {
                    from:"http://localhost/event",
                    to:"https://switcher.kr/event"
                },
                {
                    from:"/pay",
                    to:"/qa/pay"
                }],
                dest:'qa/js/'
            },
            member_eventInfo_pay_path: {
                src:["js/pay/*.js"],
                replacements:[{
                    from:"/eventInfo",
                    to:"/member/eventInfo"
                },
                {
                    from:"http://localhost/event",
                    to:"https://switcher.kr/event"
                },
                {
                    from:"/pay",
                    to:"/qa/pay"
                }],
                dest:'qa/js/pay/'
            },
            cacheBreaker : {
                src:['index.html'],
                replacements:[{
                    from:'.js',
                    to:'.js?'+"<%= grunt.template.today('sshhddmmyyyy') %>"
                }],
                dest:'build/'
            },
            cacheBreaker_pay: {
                src:['pay/*.html'],
                replacements:[{
                    from:'.js',
                    to:'.js?'+"<%= grunt.template.today('sshhddmmyyyy') %>"
                }],
                dest:'build/pay/'
            },
            member_cacheBreaker : {
                src:['index.html'],
                replacements:[{
                    from:'.js',
                    to:'.js?'+"<%= grunt.template.today('sshhddmmyyyy') %>"
                }],
                dest:'qa/'
            },
            member_cacheBreaker_pay: {
                src:['pay/*.html'],
                replacements:[{
                    from:'.js',
                    to:'.js?'+"<%= grunt.template.today('sshhddmmyyyy') %>"
                }],
                dest:'qa/pay/'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-timestamp');

    grunt.registerTask('default',['clean','replace:live_host','replace:live_pay_host','copy:main','uglify','replace:cacheBreaker','replace:cacheBreaker_pay']);
    
    grunt.registerTask('member',['clean','replace:member_eventInfo_pay_path','replace:member_eventInfo_path','copy:member','replace:member_cacheBreaker_pay','replace:member_cacheBreaker']);

};

