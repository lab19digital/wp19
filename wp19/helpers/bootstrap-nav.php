<nav class="navbar navbar-default">
  <div class="container-fluid">
    <div class="navbar-header">
      <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <a class="navbar-brand" href="./"><?php bloginfo("title") ?></a>
    </div>
    <div id="navbar" class="navbar-collapse collapse">
      <ul class="nav navbar-nav">
      <?php
        $menu_items = get_menu("main-menu");
        if(is_array($menu_items)) : ?>

        <?php foreach( $menu_items as $menu_item ) : 
            $title = $menu_item->title;
            $url = $menu_item->url;
            if( ("http://" . $_SERVER["HTTP_HOST"] . $_SERVER['REQUEST_URI'] ) == $url ):
              $menu_item->is_current_item = true;
            endif; ?>
            <li class="<?= ($menu_item->is_current_item ? 'active' : '') ?>"><a href="<?= $url ?>"><?= $title ?></a>
              <?php if( isset($menu_item->children) ) : ?>
                <ul class="dropdown hide nav">
                  <?php foreach( $menu_item->children as $child ) : ?>
                      <li><a href="<?= $child->url ?>"><?= $child->title ?></a>
                  <?php endforeach; ?>
                </ul>
              <?php endif; ?>
            </li>
        <?php endforeach; ?>
        <?php endif; ?>
      </ul>
      <ul class="nav navbar-nav navbar-right">
        <li class="active"><a href="./">Right</a></li>
      </ul>
    </div>
  </div>
</nav>