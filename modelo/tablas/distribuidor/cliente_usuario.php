<?php
/**
 * Created by PhpStorm.
 * User: Cachu
 * Date: 18/10/2017
 * Time: 10:27 AM
 */

namespace distribuidor;


class TablaCliente_Usuario extends \cbizcontrol
{
    function insertClienteUsuario($id_cliente, $id_usuario)
    {
        $sql = /** @lang MySQL */
            <<<MySQL
INSERT cliente_usuario(id_cliente, id_usuario) VALUES ('$id_cliente','$id_usuario')
MySQL;
        $this->consulta($sql);
    }
}