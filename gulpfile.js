var gulp = require("gulp"),
    through2 = require('through2');
    
function logCopied()
{
    return through2.obj(function(vinyl, enc, callback)
    {
        console.log("Copying follow file: '" + vinyl.path + "'");
        this.push(vinyl);

        callback();
    });
}

gulp.task("copy-tsjquery", function()
{
    return gulp.src("node_modules/ng2-tstypings/tsTypings/tsjquery.d.ts")
        .pipe(logCopied())
        .pipe(gulp.dest("tsTypings"));
});

gulp.task("copy-tsmoment", function()
{
    return gulp.src("node_modules/ng2-tstypings/tsTypings/tsmoment.d.ts")
        .pipe(logCopied())
        .pipe(gulp.dest("tsTypings"));
});

gulp.task("copy-tshtml2canvas", function()
{
    return gulp.src("node_modules/ng2-tstypings/tsTypings/tshtml2canvas.d.ts")
        .pipe(logCopied())
        .pipe(gulp.dest("tsTypings"));
});

gulp.task("copy-moment.node", function()
{
    return gulp.src("node_modules/ng2-tstypings/tsTypings/moment.node.d.ts")
        .pipe(logCopied())
        .pipe(gulp.dest("tsTypings"));
});

gulp.task("copy-bootstrap-select", function()
{
    return gulp.src("node_modules/ng2-tstypings/tsTypings/bootstrap-select.d.ts")
        .pipe(logCopied())
        .pipe(gulp.dest("tsTypings"));
});

gulp.task("copy-bootstrap.v3.datetimepicker", function()
{
    return gulp.src("node_modules/ng2-tstypings/tsTypings/bootstrap.v3.datetimepicker.d.ts")
        .pipe(logCopied())
        .pipe(gulp.dest("tsTypings"));
});


gulp.task("copy-tstypings", 
          ["copy-tsjquery",
           "copy-tsmoment",
           "copy-tshtml2canvas",
           "copy-moment.node",
           "copy-bootstrap-select",
           "copy-bootstrap.v3.datetimepicker"], 
          function(cb)
{
    console.log("TsTypings have been copied.");
    
    cb();
});