<?php

if( !class_exists('WP_CLI_Command') ){
  return;
}

class Generate_Block extends WP_CLI_Command {

    public $phpTemplatePath = '/functions/blocks/block-name.php.template';
    public $twigTemplatePath = '/twig/blocks/block-name.twig.template';
    public $scssTemplatePath = '/scss/blocks/block-name.scss.template';

    public function __invoke($args = array(), $assoc_args = array())
    {

      $dir = dirname(__DIR__);
      $name = $args[0];
      if(!preg_match("/^[a-zA-Z-_]+$/", $name)){
        echo "- You must define a valid block name\n";
        echo '- Only dashes or underscores and alphabetical characters allowed';
        return;
      }

      $replace = $this->create_replace( strtolower($name) );
      $phpTemplate = file_get_contents($dir . $this->phpTemplatePath);
      $twigTemplate = file_get_contents($dir . $this->twigTemplatePath);
      $scssTemplate = file_get_contents($dir . $this->scssTemplatePath);

      $this->write_file( $dir . '/functions/blocks/block-' . $name . '.php', $phpTemplate, $replace );
      $this->write_file( $dir . '/twig/blocks/block-' . $name . '.twig', $twigTemplate, $replace );
      $this->write_file( $dir . '/scss/blocks/_block-' . $name . '.scss', $scssTemplate, $replace );
      $this->replace_file( $dir . '/scss/main.scss', '// BLOCKS', "@import 'blocks/block-" . $name . "';" );
    }

    public function write_file( $path, $template, $replace ){
      if( !file_exists($path) ){
        file_put_contents(
          $path,
          str_replace( $this->create_search(), $replace, $template )
        );
        echo "- Wrote: " . $path . "\n";
      } else {
        echo "- Skipped: " . $path . " exists \n";
      }
    }

    public function replace_file( $path, $search, $replace ){
      $contents = file_get_contents( $path );
      if(strpos( $contents, $replace ) === false ){
        file_put_contents(
          $path,
          str_replace( $search, $search . "\n" . $replace, $contents )
        );
        echo "- Replaced: " . $path . "\n";
      } else {
        echo "- Skipped: Import already mentioned in " . $path;
      }
    }

    public function create_search(){
      return [
        '{block_name}',
        '{block_func}',
        '{block_title}',
      ];
    }

    public function create_replace( $name ){
      return [
        'block-' . $name,
        str_replace('-', '_', sanitize_title($name)),
        ucwords(str_replace(['_', '-'], ' ', $name))
      ];
    }


}

WP_CLI::add_command( 'generate_block', 'Generate_Block' );
