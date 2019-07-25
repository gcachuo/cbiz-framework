/**
 * Created by Memo on 20/feb/2017.
 */
var getVars;
$(function () {
    if (getUrlParameter("s")) {
        localStorage.removeItem("modulo");
    }

    window.onbeforeunload = function (e) {
        $(".loader").show();
    };
    $("#loader").attr("disabled", false);
    $(".loader").hide();
    $("[ui-nav] a").click(function (e) {
        var $this = $(e.target),
            $active,
            $li;
        $this.is("a") || ($this = $this.closest("a"));

        $li = $this.parent();
        $active = $li.siblings(".active");
        $li.toggleClass("active");
        $active.removeClass("active");
    });
    cargarDropdown();
    Dropzone.autoDiscover = false;
    $("#selectEstado").change(function () {
        $("#selectCiudad").attr("disabled", true);
        ajax("buildListaCiudades");
    });
    if ($("#floatingMenu").length !== 0)
        if (
            $("#floatingMenu")
                .html()
                .trim() !== ""
        ) {
            $(".floatingButton").show();
        }
    $(".floatingButton").click(function () {
        $(this).toggleClass("open");
        $(".quickMenu")
            .toggleClass("hidden")
            .find(".btn-icon")
            .toggleClass("open");
        $(".quickMenu")
            .find(".label")
            .toggleClass("open");
    });
    $(".quickMenu")
        .find(".btn-icon")
        .click(function () {
            $(".floatingButton").toggleClass("open");
            $(".quickMenu")
                .toggleClass("hidden")
                .find(".btn-icon")
                .toggleClass("open");
            $(".quickMenu")
                .find(".label")
                .toggleClass("open");
        });
    cargarSwitchery();
    if (getVars)
        if (getVars.tryit) {
            aside("login", "registro");
        }
    $("#btnCerrarAside").click(function () {
        if ("1" === $("#txtGuardado").val()) {
            location.reload(true);
        }
    });
    $("select").change(function () {
        if ($(this).val() === "new") {
            new Function($(this).data("new"))();
            $(this).val(0);
        }
    });
    $("select.filtro").change(function () {
        if (typeof filtrarTabla === "function") filtrarTabla();
        else console.log("No existe la funcion 'filtrarTabla' para este modulo");
    });
});

function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split("&"),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split("=");

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined
                ? true
                : decodeURIComponent(sParameterName[1]);
        }
    }
}

function btnSearch(event, modulo) {
    if (event.which === 13) {
        event.preventDefault();
        navegar(modulo, null, {
            navSearch: $("#navSearch").val()
        });
    }
}

function cargarDropdown() {
    $(".dropdown > a")
        .off("click")
        .click(function (e) {
            e.preventDefault();
            e.stopPropagation();
            $(".dropdown")
                .not($(this).parent())
                .removeClass("open");
            $(this)
                .parent()
                .toggleClass("open");
        });
    $(".dropdown > .dropdown-menu")
        .off("click")
        .click(function (e) {
            e.preventDefault();
            e.stopPropagation();
        });
    $(window)
        .off("click")
        .click(function () {
            $(".dropdown").removeClass("open");
        });
}

function cargarAcordeon() {
    $(".wizard > .box > a").click(function () {
        /*$(this).children("span").addClass("hidden");
                    $(this).parent().next().find("a span").removeClass("hidden");*/
        $(this)
            .siblings(".collapse")
            .collapse("show")
            .parent()
            .siblings()
            .children(".collapse")
            .collapse("hide");
    });
}

function showMessage(message, color) {
    $("#messages").show();
    $("#messages")
        .find("li")
        .html(message);
    $("#messages")
        .addClass("fadeInDown")
        .addClass(color);
    var interval = setInterval(function () {
        $("#messages").removeClass("fadeInDown");
        $("#messages").addClass("fadeOutUp");
        clearInterval(interval);
        interval = setInterval(function () {
            $("#messages").removeClass("fadeOutUp");
            $("#messages").hide();
            clearInterval(interval);
        }, 1000);
    }, 2000);
}

function btnCopiarTexto(inputId) {
    /* Get the text field */
    var copyText = document.getElementById(inputId);

    /* Select the text field */
    copyText.select();

    /* Copy the text inside the text field */
    document.execCommand("Copy");
}

/**
 * @param fn
 * @param post
 * @param modulo
 * @returns {*}
 */
function request(fn, post, modulo) {
    modulo = modulo || localStorage.getItem('modulo');
    var formValido = false;
    if ($("#txtAside").val() === 0)
        formValido = validarFormulario($("#frmSistema"));
    else formValido = validarFormulario($("#frmAside"));
    if (formValido) {
        $("a.btn").addClass("disabled");
        return $.post(
            `${modulo}/${fn}`,
            {
                form: $("#frmSistema").serialize(),
                aside: $("#frmAside").serialize(),
                details: $("#frmDetails").serialize(),
                post: post,
                usr: $("#usr").val()
            },
            function () {
            },
            "json"
        )
            .done(function (result) {
                if (typeof result !== "string" || !result.error) {
                    if (
                        typeof window[fn] !== "undefined" &&
                        typeof window[fn] === "function"
                    )
                        window[fn](result.response);
                } else {
                    alert(result);
                    console.error(result);
                }
            })
            .fail(function (result) {
                const message = result.responseJSON ? result.responseJSON.error.message : result.responseText;
                alert(message);
                console.error(message);
            })
            .always(function (result) {
                $("a.btn").removeClass("disabled");
                $(".loader").hide();
            });
    }
}

/**
 * @deprecated
 * @param fn
 * @param post
 * @param modulo
 * @returns {*}
 */
function ajax(fn, post, modulo) {
    var formValido = false;
    if ($("#txtAside").val() === 0)
        formValido = validarFormulario($("#frmSistema"));
    else formValido = validarFormulario($("#frmAside"));
    if (formValido) {
        $("a.btn").addClass("disabled");
        return $.post(
            "index.php",
            {
                fn: fn,
                form: $("#frmSistema").serialize(),
                aside: $("#frmAside").serialize(),
                details: $("#frmDetails").serialize(),
                post: post,
                modulo: modulo
            },
            function () {
            },
            "json"
        )
            .done(function (result) {
                if (typeof result !== "string") {
                    if (
                        typeof window[fn] !== "undefined" &&
                        typeof window[fn] === "function"
                    )
                        window[fn](result);
                } else {
                    alert(result);
                    console.error(result);
                }
            })
            .fail(function (result) {
                alert(result.responseText);
                console.error(result.responseText);
            })
            .always(function (result) {
                $("a.btn").removeClass("disabled");
                $(".loader").hide();
            });
    }
}

async function ajaxIdioma(modulo) {
    const idioma = await $.post('inicio/obtenerIdioma');
    return idioma.response[modulo] || idioma.response;
}

function uploadFiles(modulo, fn) {
    var formData = new FormData();
    var inputs = $("input[type=file]");
    $.each(inputs, function (obj, v) {
        $("a.btn").addClass("disabled");
        formData.append("file", v.files[0]);
        $.ajax({
            url: `index.php?file=true&modulo=${modulo}&folder=archivos`,
            data: formData,
            type: "POST",
            contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
            processData: false // NEEDED, DON'T OMIT THIS
        })
            .done(function (result) {
                $(".loader").show();
                ajax(fn, {filename: result}, modulo);
            })
            .fail(function (result) {
                alert(result.responseText);
                console.error(result.responseText);
            })
            .always(function (result) {
                $("a.btn").removeClass("disabled");
            });
    });
}

function navegar_externo(modulo, accion, post) {
    var form = document.createElement("form");
    form.setAttribute("method", "post");

    var field = document.createElement("input");
    field.setAttribute("type", "text");
    field.setAttribute("name", "post");
    form.setAttribute("target", "view");
    form.setAttribute(
        "action",
        location.href + "vista/" + modulo + "/" + accion + ".php"
    );
    field.setAttribute("value", JSON.stringify(post));
    form.appendChild(field);
    document.body.appendChild(form);
    window.open(
        "",
        "view",
        "_blank",
        "height=700,width=800,scrollTo,resizable=1,scrollbars=1,location=0"
    );
    //window.open(location.href+'vista/'+modulo+'/'+accion+'.php','_blank','height=700,width=800,scrollTo,resizable=1,scrollbars=1,location=0');

    form.submit();
}

function navegar(modulo, accion, post) {
    $(".loader").show();
    if (accion != null) accion = modulo + "/" + accion;
    $.post(
        "index.php?navegar-" + modulo + (accion ? "-" + accion : ''),
        {
            vista: modulo,
            accion: accion,
            post: post
        },
        function (data) {
            localStorage.setItem("modulo", modulo);
            location.reload();
        }
    );
}

function btnDownload(path) {
    window.open(path, "_blank");
}

function aside(modulo, accion, post) {
    if (
        typeof modulo != "string" ||
        typeof accion != "string" ||
        (post && typeof post != "object")
    ) {
        alert("Critical error. Contact the developer. (Wrong parameter types)");
        return;
    }

    if ($("#txtTitulo").text() == "") {
        if (post && post.name) {
            $("#txtTitulo").text(post.name || "");
        } else {
            $("#txtTitulo").text(post);
        }
    }

    $("#txtAside").val(1);
    $("#rightBar").modal();
    $("#rightBarContent").html("<div class='loading'></div>");
    $.post(
        "index.php?aside=1",
        {
            asideModulo: modulo,
            asideAccion: accion,
            form: $("#frmSistema").serialize(),
            post: post
        },
        function (result) {
            $("#rightBarContent").html(result);
            var fn = "aside" + modulo + accion;
            if (typeof window[fn] === "function") {
                window[fn]();
            }
        }
    );
}

function cerrarAside() {
    $("#txtAside").val(0);
    $("#rightBar").modal("hide");
    $("#rightBarContent").html("");
    $("#txtTitulo").text("");
}

function cargarDatatableChilds(table, fn) {
    $("table")
        .off("click", "tr")
        .on("click", "tr", function () {
            //debugger;
            //var tr = $(this).closest('tr');
            var id = $(this).attr("id");
            var row = table.row(this);

            if (row.child.isShown()) {
                // This row is already open - close it
                row.child.hide();
            } else {
                // Open this row
                row
                    .child(
                        '<div class="table-responsive"><table class="table table-striped"><tbody id="child-' +
                        id +
                        '"><tr><td>Loading...</td></tr></tbody></table></div>'
                    )
                    .show();
                ajax(fn, {id: id});
            }
        });
}

/**
 * @param idioma
 * @param {{columnDefs?:array,buttons?:array,element?,order?:number,orderby?:number,length?:number,paginate?:boolean}} params
 */
function cargarDatatable(idioma, params = {}) {
    try {
        const columnDefs = params.columnDefs,
            buttons = params.buttons,
            element = params.element;
        let order = params.order,
            orderby = params.orderby;

        var dropdown = $("td .dropdown-menu");
        if (dropdown.length !== 0) {
            $.each(dropdown, function (index, value) {
                if (
                    $(value)
                        .html()
                        .trim() === ""
                ) {
                    $(value)
                        .parent()
                        .html("");
                }
            });
        }
        var btns = buttons || [];
        var bSort = order !== -1;
        order = order && order !== -1 ? order : 0;
        orderby = orderby && order !== -1 ? orderby : 0;
        const options = {
            bPaginate:
                typeof params.paginate !== "undefined" ? params.paginate : true,
            bDestroy: false,
            iDisplayLength: params.length || -1,
            bLengthChange: false,
            bSort: bSort,
            order: [[order, orderby]],
            responsive: {
                details: {
                    type: "column",
                    target: "tr",
                    renderer: function (api, rowIdx, columns) {
                        var data = $.map(columns, function (col, i) {
                            return col.hidden
                                ? '<div class="row child"><div class="col-xs-12"><div class="form-group">' +
                                col.data +
                                "</div></div></div>"
                                : "";
                        }).join("");

                        return data ? $("<table/>").append(data) : false;
                    }
                }
            },
            columnDefs: columnDefs,
            dom:
                "<'row'<'col-xs-6'B><'col-xs-6'f>><'row'<'col-xs-12't>><'row'<'col-xs-12'p>>" /*'fBrtip'*/,
            buttons: btns,
            oClasses: {
                sFilterInput: "form-control form-control-sm p-x b-a",
                sPageButton: "btn btn-sm btn-default paginate",
                sLengthSelect: "btn white btn-sm dropdown-toggle"
            },
            language: {
                paginate: {
                    next: idioma.next,
                    previous: idioma.previous
                },
                search: "",
                sSearchPlaceholder: idioma.sSearchPlaceholder,
                sLengthMenu: idioma.sLengthMenu,
                sInfoEmpty: idioma.sInfoEmpty,
                sInfo: idioma.sInfo,
                emptyTable: idioma.sEmptyTable
            },
            initComplete: function () {
                this.api()
                    .columns(".select-filter")
                    .every(function () {
                        var column = this;
                        var select = $(
                            '<select style="width:80px;"><option value=""></option></select>'
                        )
                            .appendTo($(column.footer()).empty())
                            .on("change", function () {
                                var val = $.fn.dataTable.util.escapeRegex($(this).val());
                                column.search(val ? "^" + val + "$" : "", true, false).draw();
                            });
                        column
                            .data()
                            .unique()
                            .sort()
                            .each(function (d, j) {
                                select.append('<option value="' + d + '">' + d + "</option>");
                            });
                    });
            }
        };
        return loadDT(options, element);
    } catch (e) {
        console.error(e);
    }
}

function loadDT(options, element) {
    if (element === undefined) element = $("table");

    return element
        .on("destroyDT", function (event) {
            $(this)
                .DataTable()
                .destroy();
        })
        .one("reloadDT", function (event) {
            cargarDropdown();
            loadDT(options, $(this));
        })
        .css("width", "100%")
        .DataTable(options);
}

/**
 * @param url:string
 * @param {{
 * searchDelay:number,
 * data?:function,
 * idioma:{next,previous},
 * element?:jquery,
 * columnDefs?:Array<{}>,
 * initComplete,
 * acciones?:array<{
        icon:string,
        title:string,
        function:string
    }>}} params
 */
function cargarServerDatatable(url, params = {}) {
    const $element = params.element !== undefined ? params.element : $("table");
    const idioma = params.idioma;
    const responsive = params.responsive !== undefined ? params.responsive : true;
    const columns = params.columns !== undefined ? params.columns : false;
    const columnDefs = params.acciones
        ? [
            {
                className: "tdAcciones dropdown",
                targets: -1,
                data: null,
                render: function (data, type, row, meta) {
                    let tdAcciones = "";
                    $.each(params.acciones, function (i, val) {
                        const id = row.id || row[0];
                        tdAcciones += `
<a onclick="${val.function}(${id})" title="${val.title}" class="dropdown-item">
    <i class="material-icons">${val.icon}</i>
</a>`;
                    });
                    return `<button type="button" class="label label-lg block nav-link"><i class="material-icons md-18">more_vert</i></button>
<div class="dropdown-menu dropdown-menu-scale pull-right">
  ${tdAcciones}
</div>`;
                }
            }
        ]
        : [];
    if (params.columnDefs) {
        $.each(params.columnDefs, function (i, val) {
            columnDefs.push(val);
        });
    }
    const initComplete = () => {
        $(".loader").hide();
        $(".dropdown button").dropdown();
    };
    params.data = params.data ? params.data : function () {
    };
    let options = {
        searchDelay: params.searchDelay || 400,
        processing: true,
        serverSide: true,
        responsive,
        columns,
        ajax: {
            url,
            type: "POST",
            data: function (d) {
                d.usr = $("#usr").val();
                d = {...d, ...params.data()};
                console.log(d);
                return d;
            },
            dataSrc: function (result) {
                result.recordsTotal = result.response.recordsTotal;
                result.recordsFiltered = result.response.recordsFiltered;

                // console.log(result.response.data);
                $("#table-loader").remove();
                return result.response.data || [];
            },
            beforeSend: function () {
                $element.parent().prepend($("<div id='table-loader'><i class='fa fa-spin fa-spinner fa-3x'></i></div>"));
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $("#table-loader").remove();
                console.error(errorThrown, jqXHR);
                if (errorThrown === 'abort') {
                    alert('Request in progress. Please wait to make another request.');
                } else {
                    const error = jqXHR.responseJSON ? jqXHR.responseJSON.error : {};
                    if (error.code === 200) {
                        alert(error.message);
                    } else {
                        alert('An error ocurred. Contact the Administrator.');
                    }
                }
            }
        },
        dom:
            "<'row'<'col-xs-6'B><'col-xs-6'f>><'row'<'col-xs-12't>><'row'<'col-xs-12'p>>",
        oClasses: {
            sFilterInput: "form-control form-control-sm p-x b-a",
            sPageButton: "btn btn-sm btn-default paginate",
            sLengthSelect: "btn white btn-sm dropdown-toggle"
        },
        language: {
            paginate: {
                next: idioma.next,
                previous: idioma.previous
            },
            search: "",
            sSearchPlaceholder: idioma.sSearchPlaceholder,
            sLengthMenu: idioma.sLengthMenu,
            sInfoEmpty: idioma.sInfoEmpty,
            sInfo: idioma.sInfo,
            emptyTable: idioma.sEmptyTable
        },
        columnDefs
    };
    options.buttons = params.buttons !== undefined ? params.buttons : [];
    options.iDisplayLength = params.length !== undefined ? params.length : -1;
    options.bSort = true;
    options.order = [params.order || [0, "asc"]];
    let datatable = $element.DataTable(options);
    $element.on("datatable.ajax.reload", function () {
        datatable.ajax.reload();
    });
    datatable.on('draw', function () {
        initComplete();
        params.initComplete ? params.initComplete() : null;
    });
    return datatable;
}

function btnLimpiarFiltros() {
    //$("form")[0].reset();
    $(".header select")
        .val(0)
        .trigger("change");
}

function cargarDropzone(idioma, modulo, nombre) {
    try {
        Dropzone.autoDiscover = false;
        var url = "index.php?file=true&modulo=" + modulo + "&nombre=" + nombre;
        $(".dropzone").dropzone({
            dictDefaultMessage: idioma.dictDefaultMessage,
            dictRemoveFile: idioma.dictRemoveFile,
            url: url,
            /*addRemoveLinks: true,*/
            acceptedFiles: "image/*",
            uploadMultiple: false,
            maxFiles: 1,
            autoProcessQueue: false,
            init: function () {
                var myDropzone = this;
                var editedFile;
                this.on("addedfile", function (file) {
                    try {
                        var reader = new FileReader();

                        reader.addEventListener("load", function (event) {
                            var origImg = new Image();
                            origImg.src = event.target.result;

                            origImg.addEventListener("load", function (event) {
                                try {
                                    comp = jic.compress(origImg, 30, "jpg");
                                    editedFile = dataURItoBlob(comp.src);
                                    editedFile.lastModifiedDate = new Date();
                                    editedFile.name = file.name;
                                    editedFile.status = Dropzone.ADDED;
                                    editedFile.accepted = true;

                                    /*var origFileIndex = myDropzone.files.indexOf(file);
                                                                                               myDropzone.files[origFileIndex] = editedFile;*/

                                    myDropzone.files.push(editedFile);
                                    myDropzone.emit("addedFile", editedFile);
                                    myDropzone.createThumbnailFromUrl(editedFile);
                                    myDropzone.emit("complete", editedFile);

                                    console.log(myDropzone.files);
                                    console.log(file);
                                    console.log(editedFile);

                                    myDropzone.enqueueFile(editedFile);

                                    file.status = Dropzone.SUCCESS;
                                    file.upload.progress = 100;
                                    file.upload.bytesSent = file.upload.total;
                                    myDropzone.emit("success", file);

                                    myDropzone.processQueue();

                                    myDropzone.emit("complete", file);
                                } catch (e) {
                                    console.log(e);
                                    myDropzone.emit("reset");
                                }
                            });
                        });
                        reader.readAsDataURL(file);
                    } catch (e) {
                        console.log(e);
                    }
                });
                this.on("success", function (file, responseText) {
                    $("#txtDropzoneFile").val(responseText);
                });
                this.on("error", function (file, responseText) {
                    console.error(responseText);
                    alert(responseText);
                    myDropzone.emit("reset");
                    myDropzone.removeAllFiles();
                    console.log(myDropzone.files);
                });
                this.on("removedFile", function (file) {
                    console.log(file);
                    console.log(response);
                    console.log($("#txtDropzoneFile").val());
                });
            }
        });
    } catch (result) {
        if (result.responseText !== undefined) {
            alert(result.responseText);
            console.error(result.responseText);
        }
        console.log(result);
    }
}

function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(",")[0].indexOf("base64") >= 0)
        byteString = atob(dataURI.split(",")[1]);
    else byteString = unescape(dataURI.split(",")[1]);

    // separate out the mime component
    var mimeString = dataURI
        .split(",")[0]
        .split(":")[1]
        .split(";")[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type: mimeString});
}

function cargarNestable() {
    $("ol:empty").remove();
    $(".nestable").nestable();
    $(".dd-nodrag")
        .on("mousedown", function (event) {
            // mousedown prevent nestable click
            event.preventDefault();
            return false;
        })
        .on("click", function (event) {
            // click event
            event.preventDefault();
            return false;
        });
}

function cargarSwitchery() {
    var elems = Array.prototype.slice.call(
        document.querySelectorAll(".js-switch")
    );

    elems.forEach(function (html) {
        var switchery = new Switchery(html, {size: "small"});
    });
}

/**
 * @param elemento
 * @param eStartDate
 * @param eEndDate
 * @param idioma
 * @param fn
 * @param range
 */
function cargarDatePicker(elemento, eStartDate, eEndDate, idioma, fn, range) {
    var startDate = moment(eStartDate.val());
    var endDate = moment(eEndDate.val());
    var date = new Date();
    var sibling = elemento.siblings(".input-group-addon").eq(0);
    var datepicker = elemento;
    var ranges = {};

    if (sibling.length == 0) {
        if (eStartDate.val() === "") {
            startDate = moment([date.getFullYear(), date.getMonth()]);
            eStartDate.val(startDate.format("YYYY-MM-DD"));
        }
        if (eEndDate.val() === "") {
            endDate = moment(moment([date.getFullYear(), date.getMonth()])).endOf(
                "month"
            );
            eEndDate.val(endDate.format("YYYY-MM-DD"));
        }
    } else {
        datepicker = sibling;
        var frmt =
            eStartDate.val() !== "" && eStartDate.val() !== "0000-00-00"
                ? startDate.format(idioma.format) +
                " - " +
                endDate.format(idioma.format)
                : "";
        elemento.val(frmt).change(function () {
            eStartDate.val("");
            eEndDate.val("");
            if (elemento.val() != "") {
                const regex = /^\d?\d\/\d?\d\/\d?\d?\d\d - \d?\d\/\d?\d\/\d?\d?\d\d$/gm;
                const str = elemento.val();
                let m;
                var found = false;
                while ((m = regex.exec(str)) !== null) {
                    // This is necessary to avoid infinite loops with zero-width matches
                    if (m.index === regex.lastIndex) {
                        regex.lastIndex++;
                    }

                    // The result can be accessed through the `m`-variable.
                    m.forEach((match, groupIndex) => {
                        found = true;
                    });
                }
                if (!found) {
                    elemento.val("");
                    alert(
                        "Formato para fecha no valido. Debe ser " +
                        idioma.format +
                        " - " +
                        idioma.format
                    );
                }
                if (elemento.val().indexOf(" - ") != -1) {
                    var split = elemento.val().split(" - ");
                    eStartDate.val(moment(split[0]).format("YYYY-MM-DD"));
                    eEndDate.val(moment(split[1]).format("YYYY-MM-DD"));
                }
            }
        });
    }
    ranges[idioma.ranges.Todos] = [
        moment()
            .subtract(7, "years")
            .startOf("year"),
        moment().endOf("year")
    ];
    ranges[idioma.ranges.Hoy] = [moment(), moment()];
    ranges[idioma.ranges.Ayer] = [
        moment().subtract(1, "days"),
        moment().subtract(1, "days")
    ];
    ranges[idioma.ranges.Siete_dias] = [moment().subtract(6, "days"), moment()];
    ranges[idioma.ranges.Treinta_dias] = [
        moment().subtract(29, "days"),
        moment()
    ];
    ranges[idioma.ranges.Este_mes] = [
        moment([date.getFullYear(), date.getMonth()]),
        moment(moment([date.getFullYear(), date.getMonth()])).endOf("month")
    ];
    ranges[idioma.ranges.Mes_pasado] = [
        moment([date.getFullYear(), date.getMonth()]).subtract(1, "month"),
        moment()
            .subtract(1, "month")
            .endOf("month")
    ];
    ranges[idioma.ranges.Este_año] = [
        moment([date.getFullYear()]),
        moment(moment([date.getFullYear()])).endOf("year")
    ];
    ranges[idioma.ranges.Año_pasado] = [
        moment([date.getFullYear() - 1]),
        moment(moment([date.getFullYear() - 1])).endOf("year")
    ];

    datepicker
        .daterangepicker(
            {
                ranges: range || ranges,
                linkedCalendars: false,
                autoApply: true,
                locale: {
                    format: idioma.format,
                    customRangeLabel: idioma.customRangeLabel
                }
            },
            function (start, end, label) {
                eStartDate.val(start.format("YYYY-MM-DD"));
                eEndDate.val(end.format("YYYY-MM-DD"));
                if (sibling.length != 0) {
                    elemento.val(
                        start.format(idioma.format) + " - " + end.format(idioma.format)
                    );
                }
                if (elemento.prop("tagName") != "input") {
                    elemento.html(label);
                }
                if (fn) window[fn]();
            }
        )
        .on("cancel.daterangepicker", function (ev, picker) {
            $(this).val("");
        });
}

/**
 * @param elemento
 * @param eDate
 * @param idioma
 * @param time
 * @param {object} options
 */
function cargarSingleDatePicker(elemento, eDate, idioma, time, options = {}) {
    var format = idioma.format;
    var sibling = elemento.siblings(".input-group-addon");
    var datepicker = elemento;
    var fecha = eDate.val() === "" ? moment() : moment(eDate.val());
    if (time === undefined) time = false;
    if (time) format += " h:mm A";

    if (sibling.length != 0) {
        datepicker = sibling;

        fecha = eDate.val() === "" ? "" : moment(eDate.val());
        var frmt =
            eDate.val() !== "" && eDate.val() !== "0000-00-00"
                ? fecha.format(format)
                : "";
        elemento.val(frmt).on("change", function () {
            eDate.val("");
            if (elemento.val() != "") {
                const regex = time
                    ? /^\d?\d\/\d?\d\/\d?\d?\d\d\s\d?\d:\d\d\s(A|P)M$/gm
                    : /^\d?\d\/\d?\d\/\d?\d?\d\d$/gm;
                const str = elemento.val();
                let m;
                var found = false;
                while ((m = regex.exec(str)) !== null) {
                    // This is necessary to avoid infinite loops with zero-width matches
                    if (m.index === regex.lastIndex) {
                        regex.lastIndex++;
                    }

                    // The result can be accessed through the `m`-variable.
                    m.forEach((match, groupIndex) => {
                        found = true;
                    });
                }
                if (!found) {
                    elemento.val("");
                    alert("Formato para fecha no valido. Debe ser " + format);
                }
                eDate.val(moment(elemento.val()).format("YYYY-MM-DD HH:mm:ss"));
            }
        });
    } else {
        fecha =
            eDate.val() !== "" && eDate.val() !== "0000-00-00 00:00:00"
                ? fecha
                : moment();
        datepicker.val(fecha.format(format));
    }
    datepicker
        .daterangepicker({
            locale: {
                format: format,
                daysOfWeek: idioma.daysOfWeek,
                monthNames: idioma.monthNames
            },
            showDropdowns: true,
            autoApply: true,
            singleDatePicker: true,
            timePicker: time,
            timePickerIncrement: 15,
            maxDate: options.maxDate || null
        })
        .on("cancel.daterangepicker", function (ev, picker) {
            $(this).val("");
        });
    datepicker
        .on("apply.daterangepicker", function (ev, picker) {
            if (picker === undefined) picker = datepicker.data("daterangepicker");

            eDate.val(picker.startDate.format("YYYY-MM-DD HH:mm:ss"));
            if (sibling.length != 0) {
                elemento.val(picker.startDate.format(format));
            }
        })
        .on("change", function () {
            eDate.val("");
            if (elemento.val() != "") {
                eDate.val(moment(elemento.val()).format("YYYY-MM-DD HH:mm:ss"));
            }
        });
    if (sibling.length == 0) datepicker.trigger("apply.daterangepicker");
}

function cargarDoughnut(id, data, names, color) {
    var myChart = echarts.init(document.getElementById(id));
    myChart.setOption({
        tooltip: {
            transitionDuration: 0,
            showDelay: 0,
            hideDelay: 0,
            position: [0, 0],
            trigger: "item",
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: "vertical",
            x: "left",
            textStyle: {
                color: "auto"
            },
            data: names
        },
        calculable: true,
        series: [
            {
                name: id,
                itemStyle: {
                    normal: {
                        label: {
                            show: false,
                            textStyle: {
                                color: "rgba(165,165,165,1)"
                            }
                        },
                        labelLine: {
                            show: false,
                            lineStyle: {
                                color: "rgba(165,165,165,1)"
                            }
                        },
                        color: function (params) {
                            var red = color.red + params.dataIndex * 33;
                            var green = color.green + params.dataIndex * 33;
                            var blue = color.blue + params.dataIndex * 33;
                            return "rgba(" + red + "," + green + "," + blue + ",1)";
                        }
                    }
                },
                type: "pie",
                radius: ["50%", "70%"],
                data: data
            }
        ]
    });
    return myChart;
}

function cargarDoughnut2(id, data, color) {
    var myChart = echarts.init(document.getElementById(id));
    myChart.setOption({
        title: {
            x: "center",
            y: "center",
            itemGap: 20,
            textStyle: {
                color: "rgba(30,144,255,0.8)",
                fontSize: 20,
                fontWeight: "bolder"
            }
        },
        tooltip: {
            transitionDuration: 0,
            showDelay: 0,
            hideDelay: 0,
            position: [0, 0],
            show: true,
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: "vertical",
            x: $("#pie").width() / 2 + 10,
            y: 20,
            itemGap: 12,
            textStyle: {
                color: "auto"
            },
            data: [data.name1, data.name2]
        },
        series: [
            {
                name: data.name1,
                type: "pie",
                clockWise: false,
                radius: [50, 70],
                itemStyle: {
                    normal: {
                        label: {show: false},
                        labelLine: {show: false},
                        color:
                            "rgba(" +
                            color[0].red +
                            "," +
                            color[0].green +
                            "," +
                            color[0].blue +
                            ",1)"
                    }
                },
                data: [
                    {
                        value: data.value1,
                        name: data.name1
                    },
                    {
                        value: data.value2,
                        name: "invisible",
                        itemStyle: {
                            normal: {
                                color: "rgba(0,0,0,0)",
                                label: {show: false},
                                labelLine: {show: false}
                            },
                            emphasis: {
                                color: "rgba(0,0,0,0)"
                            }
                        }
                    }
                ]
            },
            {
                name: data.name2,
                type: "pie",
                clockWise: false,
                radius: [30, 50],
                itemStyle: {
                    normal: {
                        label: {show: false},
                        labelLine: {show: false},
                        color:
                            "rgba(" +
                            color[1].red +
                            "," +
                            color[1].green +
                            "," +
                            color[1].blue +
                            ",1)"
                    }
                },
                data: [
                    {
                        value: data.value2,
                        name: data.name2
                    },
                    {
                        value: data.value1,
                        name: "invisible",
                        itemStyle: {
                            normal: {
                                color: "rgba(0,0,0,0)",
                                label: {show: false},
                                labelLine: {show: false}
                            },
                            emphasis: {
                                color: "rgba(0,0,0,0)"
                            }
                        }
                    }
                ]
            }
        ]
    });
    return myChart;
}

function cargarAutocomplete(obj, input) {
    var source = Object.keys(obj).map(function (key) {
        return obj[key];
    });
    input.autocomplete({
        source: source
    });
}

function cerrarSesion() {
    navegar("login");
    localStorage.removeItem("modulo");
}

function btnMiPerfil() {
    aside("miperfil", "miperfil");
}

function btnCuenta() {
    aside("miperfil", "cuenta");
}

function buildListaCiudades(result) {
    $("#selectCiudad")
        .html(result.listaCiudades)
        .attr("disabled", false);
}

function asidetransaccionesnuevo() {
    var tipo = $("#selectTipo").val();
    if (tipo !== "" && tipo !== 3 && $("input[name=idTransaccion]").val() == "") {
        ajax(
            "buildListaCategorias",
            {tipo: $("#selectTipo").val()},
            "transacciones"
        );
    }
}

function validarFormulario(form) {
    const $myForm = $(form);
    if ($myForm[0] !== undefined) {
        const valid = $myForm[0].checkValidity();
        if (!valid) {
            $('<input type="submit">')
                .hide()
                .appendTo($myForm)
                .click()
                .remove();
        }
        return valid;
    }
}

function compress(source_img_obj, quality, maxWidth, output_format) {
    var mime_type = "image/jpeg";
    if (typeof output_format !== "undefined" && output_format == "png") {
        mime_type = "image/png";
    }

    maxWidth = maxWidth || 1000;
    var natW = source_img_obj.naturalWidth;
    var natH = source_img_obj.naturalHeight;
    var ratio = natH / natW;
    if (natW > maxWidth) {
        natW = maxWidth;
        natH = ratio * maxWidth;
    }

    var cvs = document.createElement("canvas");
    cvs.width = natW;
    cvs.height = natH;

    var ctx = cvs.getContext("2d").drawImage(source_img_obj, 0, 0, natW, natH);
    var newImageData = cvs.toDataURL(mime_type, quality / 100);
    var result_image_obj = new Image();
    result_image_obj.src = newImageData;
    return result_image_obj;
}

function madePdf(idVenta) {
    ajax("crearCotizacionPdf", {id: idVenta}, "cotizaciones");
}

/**
 * @param {{control:string, action:string}} module
 * @param {string} responseTarget
 * @param {object} params
 * @param {jquery} $element
 */
async function modal(module, responseTarget, params, $element) {
    $element.html('<div style="display: flex; align-items: center; justify-content: center; height: 100%;"><i class="fa fa-spin fa-spinner fa-5x"></i></div>').modal();
    $element.on("click", event => event.preventDefault());
    const result = await $.post(
        `${module.control}/${module.action}`,
        params,
        "json"
    );
    console.log(result);
    switch (parseInt(result.code)) {
        case 200:
            return $.post(
                `modalPetitions/${responseTarget}.php`,
                {post: JSON.stringify(result.response)},
                response => {
                    $element
                        .html(
                            `<div class="close-modal" id="btnCloseModal">
                    <i class="material-icons">close</i>
                </div>${response}`
                        );
                },
                "html"
            );
    }
}

/**
 * @param {{control:string, action:string}} module
 * @param {string} responseTarget
 * @param {object} params
 * @param {jquery} $element
 */
function loadContent(module, responseTarget, params, $element) {
    $element.on("click", event => event.preventDefault());
    $.post(`${module.control}/${module.action}`, params).done(result => {
        console.log(result);
        switch (parseInt(result.code)) {
            case 200:
                return $.post(
                    `modalPetitions/${responseTarget}.php`,
                    result.response,
                    response => $element.html(`${response}`)
                );
        }
    }).fail(data => {
        console.error(data);
        alert('An error has ocurred. Contact the Administrator.')
    });
}

/**
 * @param {{width,height,orientation,title,scripts,auto_print}} options
 */
async function printPDF(options) {
    options = {
        width: options.width || 21,
        height: options.height || 29.7,
        orientation: options.orientation || 'portrait',
        title: options.title || 'Report',
        scripts: options.scripts || [],
        auto_print: options.auto_print === undefined ? true : options.auto_print
    };
    var divContents = $(".reporte").html();
    var printWindow = window.open('', '', `height=800,width=1123`);
    printWindow.document.write(`<html><head><title>${options.title}</title>`);
    printWindow.document.write(`
<link rel="stylesheet" href="framework/recursos/css/lib/animate.css" type="text/css">
<link rel="stylesheet" href="framework/libs/glyphicons/glyphicons.css" type="text/css">
<link rel="stylesheet" href="framework/libs/font-awesome/css/font-awesome.min.css" type="text/css">
<link rel="stylesheet" href="framework/libs/material-design-icons/material-design-icons.css" type="text/css">


<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jquery-modal/0.9.1/jquery.modal.min.css">
<link rel="stylesheet" href="framework/libs/bootstrap/dist/css/bootstrap.min.css" type="text/css">
<!-- build:css ../assets/styles/app.min.css -->
<link rel="stylesheet" href="framework/recursos/css/lib/app.min.css" type="text/css">
<!-- endbuild -->
<link rel="stylesheet" href="framework/recursos/css/lib/font.css" type="text/css">

<!--PLUGINS-->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/fullcalendar@3.9.0/dist/fullcalendar.css" type="text/css">
<link rel="stylesheet" href="framework/libs/dropzone/dropzone.css" type="text/css">
<link rel="stylesheet" href="framework/libs/select2/css/select2.css" type="text/css">
<link rel="stylesheet" href="framework/libs/datatables/integration/bootstrap/3/dataTables.bootstrap.css">
<link rel="stylesheet" href="framework/libs/daterangepicker/daterangepicker.css" type="text/css">
<link rel="stylesheet" href="framework/libs/nestable/jquery.nestable.css" type="text/css">
<!--END PLUGINS-->

<link rel="stylesheet" href="framework/recursos/css/lib/wrap.css" type="text/css">
<link rel="stylesheet" href="./recursos/css/lib/styles.css" type="text/css">
`);

    printWindow.document.write(`
<style type="text/css" media="print">
    @page {
        size: ${options.orientation};
        width: ${options.width}cm;
        height: ${options.height}cm;
    }
    .chartdiv {
        width: 100%;
        height: 612px; 
        max-height: 400px;
        max-width: 400px;
        margin: auto;
    }    
    .card{
        margin: 0;
    }
</style>
<style>
    @page {
        size: ${options.orientation};
        width: ${options.width}cm;
        height: ${options.height}cm;
    }
    .d-flex {
        display: flex;
    }

    .justify-between {
        justify-content: space-between;
    }
    .chartdiv {
        height: 400px; 
        width: 400px;
        margin: auto;
    }    
    .card{
        margin: 0;
    }
</style>
`);
    printWindow.document.write('</head><body >');
    printWindow.document.write(divContents);
    printWindow.document.write(`
<script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.8.0/Chart.js"></script>
<script src="framework/libs/session-timeout/session-timeout.js"></script>
<script src="framework/libs/dropzone/dropzone.js"></script>
<script src="framework/recursos/js/lib/globales.js"></script>
`);
    $.each(options.scripts, function (i, script) {
        printWindow.document.write(`<script src="${script}"></script>`);
    });
    if (options.auto_print) {
        printWindow.document.write(`<script>window.print();</script>`);
    } else {
        $(printWindow.document).ready(function () {
            console.log('readyprint');
        });
    }
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.open('', '_blank');
}