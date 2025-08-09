let usuarioLogado = null;

function setUsuario(usuario) {
    usuarioLogado = usuario;
}

function getUsuario() {
    return usuarioLogado;
}

function logout() {
    usuarioLogado = null;
}

module.exports = { setUsuario, getUsuario, logout };