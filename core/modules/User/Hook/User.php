<?php

namespace SoosyzeCore\User\Hook;

class User implements \SoosyzeCore\User\UserInterface
{
    /**
     * @var \Soosyze\Config
     */
    private $config;

    /**
     * @var User
     */
    private $user;

    public function __construct($config, $user)
    {
        $this->config = $config;
        $this->user   = $user;
    }

    public function hookUserPermissionModule(array &$permissions)
    {
        $permissions[ 'User' ] = [
            'user.people.manage'     => 'Administer users',
            'user.permission.manage' => 'Administer permissions',
            'user.showed'            => 'View user profiles',
            'user.edited'            => 'Edit your user account',
            'user.deleted'           => 'Delete your user account'
        ];
        $permissions[ 'User role' ][ 'role.all' ] = 'Assign all roles';
        foreach ($this->user->getRolesAttribuable() as $role) {
            $permissions[ 'User role' ][ 'role.' . $role[ 'role_id' ] ] = [
                'name' => 'Assign the role :name',
                'attr' => [ ':name' => $role[ 'role_label' ] ]
            ];
        }
    }

    public function hookPermissionAdminister()
    {
        return 'user.permission.manage';
    }

    public function hookPeopleAdminister()
    {
        return 'user.people.manage';
    }

    public function hookUserShow($id, $req, $user)
    {
        if ($id == $user[ 'user_id' ]) {
            return true;
        }

        return [ 'user.people.manage', 'user.showed' ];
    }

    public function hookUserEdited($id, $req, $user)
    {
        $output[] = 'user.people.manage';
        if ($id == $user[ 'user_id' ]) {
            $output[] = 'user.edited';
        }

        return $output;
    }

    public function hookUserDeleted($id, $req, $user)
    {
        $output[] = 'user.people.manage';
        if ($id == $user[ 'user_id' ]) {
            $output[] = 'user.deleted';
        }

        return $output;
    }

    public function hookRegister($req, $user)
    {
        return empty($user) && $this->config->get('settings.user_register');
    }

    public function hookActivate($id, $token, $req, $user)
    {
        return empty($user) && $this->config->get('settings.user_register');
    }

    public function hookLogin($url, $req, $user)
    {
        if ($this->user->isConnectUrl($url)) {
            return false;
        }

        return empty($user);
    }

    public function hookLoginCheck($url, $req, $user)
    {
        if ($this->user->isConnectUrl($url)) {
            return false;
        }
        /* Si le site est en maintenance. */
        if (!$this->config->get('settings.maintenance')) {
            return empty($user);
        }
        /* Et que l'utilisateur qui se connect existe. */
        $post = $req->getParsedBody();
        if (!isset($post[ 'email' ]) || !filter_var($post[ 'email' ], FILTER_VALIDATE_EMAIL)) {
            return false;
        }
        if (!($userActived = $this->user->getUserActived($post[ 'email' ]))) {
            return false;
        }
        /* Si l'utilisateur à le droit de se connecter en mode maintenance. */
        return $this->user->getGranted($userActived, 'system.config.maintenance');
    }

    public function hookLogout($req, $user)
    {
        return !empty($user);
    }

    public function hookRelogin($url, $req, $user)
    {
        if ($this->user->isConnectUrl($url)) {
            return false;
        }

        return empty($user) && $this->config->get('settings.user_relogin');
    }

    public function hookRoleDeleted($idRole)
    {
        /* Si le role est requis par le système, alors la suppression est interdite. */
        if (in_array($idRole, [ 1, 2, 3 ])) {
            return false;
        }

        return 'user.people.manage';
    }

    public function hookUserApiSelect($req, $user)
    {
        return !empty($user);
    }
}
