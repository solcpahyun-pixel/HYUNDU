/* =====================================================
COMMON
K-ICTC Speaking Reader
===================================================== */

const $ = id => document.getElementById(id);

function escapeHTML(str){

    return String(str).replace(
        /[&<>"']/g,
        c => ({
            "&":"&amp;",
            "<":"&lt;",
            ">":"&gt;",
            '"':"&quot;",
            "'":"&#39;"
        }[c])
    );

}