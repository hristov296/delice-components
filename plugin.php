<?php
/**
 * Plugin Name: React components
 * Description: React components
 * Author: supersait
 * Version: 1.0.0
 * License: GPL2+
 *
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class ReactElements {
	public $data = [];

	function __construct() {
		if (class_exists('Vc_Manager')) {
			vc_add_shortcode_param( 'select_categories', array($this, 'select_categories_type_cb') );

		}
		
		add_action( 'rest_api_init', function () {
			register_rest_route( 'rcv2/v1', '/sendmail', array(
				'methods' => 'POST',
				'callback' => array($this, 'receiving_mail'),
			) );
		} );

		add_action( 'vc_before_init', array( $this, 'vc_map_custom_elements') );
		add_shortcode( 'sscatre', array($this, 'sc_cat_re') );
		add_shortcode( 'ssproducts', array($this, 'sc_show_products') );
		add_shortcode( 'ss_canvas_logos', array($this, 'ss_logos_canvas'));
		add_shortcode( 'delice_calculator', array($this, 'ss_delice_calculator') );

		add_action( 'ss_single_product_render', array( $this, 'single_prod_render'), 10);

		add_action( 'wp_enqueue_scripts', array($this, 'add_script_tags'), 1 );
	}

	function add_script_tags(){
		$suffix = ( defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ) ? '' : '.min';
		wp_register_script( 'react', 'https://unpkg.com/react@16/umd/react.production.min.js', array(), '', true);
		wp_register_script( 'react-dom', 'https://unpkg.com/react-dom@16/umd/react-dom.production.min.js', array(), '', true);
		wp_register_script( 'react-commons' , plugins_url( 'dist/commons.delice-react'.$suffix.'.js',  __FILE__ ), array(), '', true);

		wp_register_script( 'show-products' , plugins_url( 'dist/show-products.delice-react'.$suffix.'.js',  __FILE__ ), array('react','react-dom','react-commons'), '', true);
		wp_register_script( 'cat-carousel' , plugins_url( 'dist/cat-carousel.delice-react'.$suffix.'.js',  __FILE__ ), array('react','react-dom','react-commons'), '', true);
		wp_register_script( 'single-product' , plugins_url( 'dist/single-product.delice-react'.$suffix.'.js',  __FILE__ ), array('react','react-dom','react-commons'), '', true);
		wp_register_script( 'calculator' , plugins_url( 'dist/calculator.delice-react'.$suffix.'.js',  __FILE__ ), array('react','react-dom','react-commons'), '', true);
		
		wp_localize_script( 'react-commons', 're_preload', array('url' => get_template_directory_uri().'/dist/img/preload.png'));
	}

	function receiving_mail($data) {
		// error_log(print_r($data->get_params(),true));
		$params = $data->get_params();
	
		$subject = 'Ново запитване за RenoMatic 2020';
		$headers = array(
			'Content-Type: text/html; charset=UTF-8',
			'From: Delice.BG <webmaster@delice.bg>',
			'Reply-To: '.$params['form-name'].' <'.$params['form-email'].'>'
		);
	
		$body = '
		Име: '.$params["form-name"].'<br/>
		Град: '.$params["form-city"].'<br/>
		Телефон: '.$params["form-phone"].'<br/>
		Имейл: '.$params["form-email"].'<br/><br/>
		
		Съобщение: '.$params["form-message"].'<br/><br/>
	
		-------------------- <br/><br/>
	
		Дизайн: '.$params["lines"].'<br/>
		Цвят: '.$params["color"].'<br/><br/>
	
		Аварийно отваряне: '.$params["opening"].'<br/>
		Допълнително дистанционно: '.$params["remote"].'<br/><br/>
	
		Мерки:<br/>
		- A: '.$params["measure-a"].' см.<br/>
		- B: '.$params["measure-b"].' см.<br/>
		- C: '.$params["measure-c"].' см.<br/>
		- D: '.$params["measure-d"].' см.<br/>
		- E: '.$params["measure-e"].' см.<br/>
		- F: '.$params["measure-f"].' см.<br/><br/>
	
		Избран модел: '.$params["model"]; 
		
		if ($params['horCut']){
			$body .= ' + прерязване по широчина';
		}
		
		if ($params['verCut']){
			$body .= ' + прерязване по височина';
		}
		
		$body .= '<br/><br/>
	
		Възможни модели:<br/>';
	
	
		foreach ($params["possibleModels"] as $model) {
			$body .= "- ".$model["model"];
			if ($model["value"][0] === 2) {
				$body .= " + прерязване по широчина";
			}
			if ($model["value"][1] === 2) {
				$body .= " + прерязване по височина";
			}
			$body .= '<br/>';
		}
	
		// error_log(print_r($body,true));
		wp_mail('office@delice.bg', $subject, $body, $headers);
		wp_mail('ambedorn@gmail.com', $subject, $body, $headers);
	
		return new WP_REST_Response( '', 200 );
	}
	
	function generate_name($prefix) {
		$chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		return $prefix.substr(str_shuffle($chars), 0, 10);
	}

	function ss_delice_calculator() {
		wp_enqueue_script('react');
		wp_enqueue_script('react-dom');
		wp_enqueue_script('react-commons');
		wp_enqueue_script('calculator');
	
		return '<div id="delice-renomatic-calculator" ></div>';
	}
	
	function single_prod_render() {
		wp_enqueue_script('react');
		wp_enqueue_script('react-dom');
		wp_enqueue_script('react-commons');
		wp_enqueue_script('single-product');

		global $product;
		$re_data;

		$re_data['type'] = $product->get_type();
		$re_data['name'] = $product->get_name();
		$re_data['short_desc'] = wpautop($product->get_short_description());
		$re_data['cf7'] = do_shortcode( '[contact-form-7 id="436"]' );
		$re_data['product_link'] = do_shortcode('[ss_button style="4"]');

		$prod_thumb_id = $product->get_image_id();
		if (!$prod_thumb_id) {
			$prod_thumb_id = 233;
		}
		$re_data['thumbnail'] = array(
			'main_size' => wp_get_attachment_image_src($prod_thumb_id, 'woocommerce_single'),
			'thumb_size' => wp_get_attachment_image_src($prod_thumb_id, 'woocommerce_gallery_thumbnail'),
			'full_size' => wp_get_attachment_image_src($prod_thumb_id, 'full')
		);

		$re_data['main_gallery'] = [];
		foreach ($product->get_gallery_image_ids() as $key => $value) {
			$re_data['main_gallery'][] = array(
				'main_size' => wp_get_attachment_image_src($value, 'woocommerce_single'),
				'thumb_size' => wp_get_attachment_image_src($value, 'woocommerce_gallery_thumbnail'),
				'full_size' => wp_get_attachment_image_src($value, 'full')
			);
		}

		foreach (wc_get_product_terms( $product->get_id(), 'pa_features', array( 'fields' => 'all' ) ) as $feat) {
			$re_data['pa_features'][$feat->slug] = $feat->name;
		}

		$prod_fields = array();

		$vc = new VC_Base();
		$prod_fields['prod_desc'] = apply_filters('the_content', get_post_field('post_content', $product->get_id()));
		$vc->addPageCustomCss($product->get_id());
		$vc->addShortcodesCustomCss($product->get_id());
		if ($post_content_id = get_field('post_content_id')) {
			$prod_fields['prod_desc'] .= apply_filters('the_content', get_post_field('post_content', $post_content_id));
			$vc->addPageCustomCss((int)$post_content_id);
			$vc->addShortcodesCustomCss((int)$post_content_id);
		}
		if (have_rows('product_details')) {
			while (have_rows('product_details')) : the_row();
				$prod_fields['prod_details'][] = array('name' => get_sub_field('details_name'), 'value' => get_sub_field('details_value'));
			endwhile;
		}

		$prod_fields['prod_info'] = get_field('product_info');
		$prod_fields['prod_dimensions'] = get_field('prod_dimensions');
		$prod_fields['prod_gallery'] = get_field('product_gallery');
		$prod_fields['prod_files'] = get_field('prod_files');
		$prod_fields['prod_video'] = get_field('product_video');


		foreach ($prod_fields as $key => $value) {
			if ($value) {
				$re_data['tabs'][$key] = $value;
			}
		}

		$rel_ids = $product->get_cross_sell_ids();
		$cats = get_the_terms($product->get_id(), 'product_cat');

		if (!$rel_ids) {
			$rel_products = wc_get_products( array(
				'limit' => 4,
				'exclude' => array( $product->get_id() ),
				'category' => array_map(function($post){return $post->slug;}, $cats)
			));
		} else {
			$rel_products = wc_get_products( array(
				'include' => $rel_ids,
			));
		}

		foreach ($rel_products as $prod) {
			
			$short_desc = $prod->get_short_description();
			$is_str_big = mb_strlen($short_desc) < 255 ? false : true;
			$prod_short_desc = $short_desc !== '' ?  $is_str_big ? mb_substr($short_desc, 0, 255).'...' : $short_desc : '';
	
			$temp_products[] = array(
				'thumbnail' => $prod->get_image(),
				'title' => $prod->get_name(),
				'link' => $prod->get_permalink(),
				'desc' => $prod_short_desc,
				'price_html' => $prod->get_price_html()
			);
		}

		$re_data['related'] = $temp_products;

		if ($product->is_type('variable')) {
			$attrinfo;
			foreach ($product->get_variation_attributes() as $tax => $terms ) {
				$attrinfo[$tax] = array();
				foreach ($terms as $term) {
					$curr_term = get_term_by('slug', $term, $tax);
					$curr_img = get_field('attr_image', $tax.'_'.$curr_term->term_id );					
					
					$attrinfo[$tax][$term] = array(
						// 'group' => $tax,
						'name' => $curr_term->name,
						'image_full' => wp_get_attachment_image_src($curr_img, 'full'),
						'image_thumb' => wp_get_attachment_image_src($curr_img, 'variations-thumb'),
					);
				}
			}
			
			foreach ($product->get_children() as $child_id) {
				$curr_product = wc_get_product($child_id);				
				$curr_variation = $curr_product->get_variation_attributes();
				$curr_price = $curr_product->get_price();
				$reg_price = $curr_product->get_regular_price();
				$attrinfo['pa_surface'][$curr_variation["attribute_pa_surface"]]['combinations'][$curr_variation["attribute_pa_color"]] = array('active_price'=>$curr_price, 'sale_price' => $reg_price);
				$attrinfo['pa_color'][$curr_variation["attribute_pa_color"]]['combinations'][$curr_variation["attribute_pa_surface"]] = array('active_price'=>$curr_price, 'sale_price' => $reg_price);
 			}
			
			$re_data['attr_data'] = $attrinfo;
		} else {
			$re_data['simple_prod_reg_price'] = $product->get_regular_price();
			$re_data['simple_prod_price'] = $product->get_price();
		}
		if (in_array($product->get_id(), [3565,3566])) {
			$re_data['link_to_calc'] = true;
			$re_data['calculator_link'] = do_shortcode('[ss_button text="Към калкулатор" link="page:5132" align="right"]');
		}
		
		wp_localize_script( 'single-product', 're_data', $re_data );	
		echo '<div id="single-product-render"><img class="site-preloader" src="https://delice.bg/wp-content/themes/delice/dist/img/preload.png" /></div>';
	}

	function ss_logos_canvas() {
		return '<div class="delice-partners"></div>';
	}

	function sc_show_products($attr) {
		wp_enqueue_script('react');
		wp_enqueue_script('react-dom');
		wp_enqueue_script('react-commons');
		wp_enqueue_script('show-products');

		$attr = shortcode_atts(array(
			'ssprodids' => '',
			'cat_ids' => '',
			'ssprodcount' => '4',
			'ssprod_present' => false
		),$attr);
		
		$re_data;
		$el_id = $this->generate_name('re_sp_');		
		
		$gen_data['shortcodes'] = array(
			'product_link' => do_shortcode('[ss_button style="4"]'),
		);
		
		if ($attr['ssprodids'] !== '') {
			$ssprodids = explode(',', $attr['ssprodids']);
			
			$re_data['products'] = $this->get_products_by_ids($ssprodids, $attr['ssprod_present'] ? 'full' : null);
		} elseif ($attr['cat_ids'] !== '') {
			$cat_ids = explode(',', $attr['cat_ids']);
			
			$re_data['cats'] = $this->get_products_by_cat($cat_ids, (int) $attr['ssprod_count'], $attr['ssprod_present'] ? 'full' : null);
		}
		$re_data['attr'] = array('presentational' => $attr['ssprod_present']);

		wp_localize_script( 'show-products', 're_sp_data', $gen_data );
		wp_localize_script( 'show-products', $el_id, $re_data );

		return '<div id="'.$el_id.'" class="react-element-show-products"></div>';
	}

	function sc_cat_re($attr) {
		wp_enqueue_script('react');
		wp_enqueue_script('react-dom');
		wp_enqueue_script('react-commons');
		wp_enqueue_script('cat-carousel');

		$attr = shortcode_atts(array(
			'catids' => '',
			'title' => '',
			'title_tag' => 'h2',
			'product_count' => '3'
		),$attr);

		$catids = explode(',', $attr['catids']);
		$el_id = $this->generate_name('re_cc_');

		$gen_data['shortcodes'] = array(
			'product_link' => do_shortcode('[ss_button style="4"]'),
			'cat_link' => do_shortcode('[ss_button text="Виж всички продукти" align="right"]'),
		);

		$re_data['data'] = array(
			'title' => $attr['title'],
			'title_tag' => $attr['title_tag'],
		);

		$re_data = array_merge($re_data, $this->get_products_by_cat($catids, (int) $attr['product_count']));

		wp_localize_script( 'cat-carousel', 're_cc_data', $gen_data );
		wp_localize_script( 'cat-carousel', $el_id, $re_data );		

		return '<div id="'.$el_id.'" class="react-element-cat-carousel"></div>';
	}

	function vc_map_custom_elements() {
		vc_map( array(
			'name' => 'Delice Renomatic Calculator',
			'base' => 'delice_calculator',
			'icon' => 'icon-heart',
			'group' => 'SS',
			'category' => 'SS',
			'params' => array(

			)
		));

		vc_map(array(
			'name' => 'Delice Categories Carousel',
			'base' => 'sscatre',
			'icon' => 'icon-heart',
			'group' => 'SS',
			'category' => 'SS',
			'params' => array(
				array(
					'type' => 'textfield',
					'heading' => 'Title',
					'param_name' => 'title'
				),
				array(
					'type' => 'autocomplete',
					'heading' => 'Select categories',
					'param_name' => 'catids',
					'settings' => array(
						'multiple' => true,
						'sortable' => true,
						'unique_values' => true,
					),
					'save_always' => true,
				),
				// array(
				// 	'type' => 'select_categories',
				// 	'heading' => 'Select categories',
				// 	'param_name' => 'cat_ids',
				// 	'settings' => array(
				// 		'multiple' => true,
				// 	)
				// ),
				array(
					'type' => 'textfield',
					'heading' => 'Products per category',
					'param_name' => 'product_count'
				),
				array(
					'type' => 'dropdown',
					'class' => '',
					'heading' => __( 'Title tag', 'ss' ),
					'param_name' => 'title_tag',
					'value' => array(
						'h2',
						'h1',
						'h3',
						'h4',
						'h5',
						'h6',
						'div',
						'p',
					),
				)
			)
		));

		vc_map( array(
			'name' => 'Delice Products',
			'base' => 'ssproducts',
			'icon' => 'icon-heart',
			'group' => 'SS',
			'category' => 'SS',
			'params' => array(
				array(
					'type' => 'autocomplete',
					'param_name' => 'ssprodids',
					'heading' => 'Select Products',
					'settings' => array(
						'multiple' => true,
						'sortable' => true,
						'unique_values' => true,
					),
					'save_always' => true,
					'description' => __( 'Enter List of Products', 'js_composer' ),
				),
				array(
					'type' => 'textfield',
					'param_name' => 'ssprodcount',
					'heading' => 'Product count',					
				),
				array(
					'type' => 'select_categories',
					'heading' => 'Or Select category',
					'param_name' => 'cat_ids',
					'settings' => array(
						'multiple' => false,
					)
				),
				array(
					'type' => 'checkbox',
					'heading' => 'Presentational',
					'param_name' => 'ssprod_present',
				)
			)
		));

		vc_map( array(
			'name' => 'Delice Renomatic Calculator',
			'base' => 'delice_calculator',
			'icon' => 'icon-heart',
			'group' => 'SS',
			'category' => 'SS',
			'params' => array(
	
			)
		));

		if (class_exists('Vc_Vendor_Woocommerce')) {
			$vc_vendor_wc = new Vc_Vendor_Woocommerce();
			add_filter( 'vc_autocomplete_ssproducts_ssprodids_callback', array($vc_vendor_wc,'productIdAutocompleteSuggester'), 10, 1 );
			add_filter( 'vc_autocomplete_ssproducts_ssprodids_render', array($vc_vendor_wc,'productIdAutocompleteRender'), 10, 1 );
			add_filter( 'vc_autocomplete_sscatre_catids_callback', array($vc_vendor_wc,'productCategoryCategoryAutocompleteSuggester'), 10, 1 );
			add_filter( 'vc_autocomplete_sscatre_catids_render', array($vc_vendor_wc,'productCategoryCategoryRenderByIdExact'), 10, 1 );
		}
		
	}

	function get_products_by_ids($prod_ids, $thumb_size) {
		$curr_products = wc_get_products( array(
			'include' => $prod_ids
		));
		foreach ($curr_products as $prod) {
			
			$short_desc = $prod->get_short_description();
			$is_str_big = mb_strlen($short_desc) < 255 ? false : true;
			$prod_short_desc = $short_desc !== '' ?  $is_str_big ? mb_substr($short_desc, 0, 255).'...' : $short_desc : '';

			$temp_products[] = array(
				'thumbnail' => $prod->get_image($thumb_size),
				'title' => $prod->get_name(),
				'link' => $prod->get_permalink(),
				'desc' => $prod_short_desc,
				'price_html' => $prod->get_price_html()
			);
		}

		return $temp_products;
	}

	function get_products_by_cat($cat_ids, $prod_count) {
		$ret_products = [];
		foreach ($cat_ids as $id) {
			$temp_products = [];
			$curr_cat = get_term($id, 'product_cat');

			$curr_products = wc_get_products( array(
				'limit' => intval($prod_count),
				'category' => $curr_cat->slug
			));

			foreach ($curr_products as $prod) {
					
				$short_desc = $prod->get_short_description();
				$is_str_big = mb_strlen($short_desc) < 255 ? false : true;
				$prod_short_desc = $short_desc !== '' ?  $is_str_big ? mb_substr($short_desc, 0, 255).'...' : $short_desc : '';

				$temp_products[] = array(
					'thumbnail' => $prod->get_image(),
					'title' => $prod->get_name(),
					'link' => $prod->get_permalink(),
					'desc' => $prod_short_desc,
					'price_html' => $prod->get_price_html()
				);

			}

			$ret_products['cats'][] = array(
				'name' => $curr_cat->name,
				'desc' => $curr_cat->description,
				'icon' => get_field('product_cat_icon', 'product_cat_'.$id),
				'link' => get_term_link((int)$id, 'product_cat'),
				'products' => $temp_products,
			);

		}

		return $ret_products;
	}

	function select_categories_type_cb( $settings, $value ) {
		$terms = get_terms(array(
			'taxonomy' => 'product_cat',
		));
		
		$values = is_array($value) ? $value : explode(',', $value);
		$multiple = $settings['settings']['multiple'] ? 'multiple' : '';
		ob_start();
		echo '<div class="select_cats">';
		
		echo '<select '.$multiple.' class="wpb_vc_param_value" name="' . esc_attr( $settings['param_name'] ) . '">';
		
		foreach ($terms as $term) {
			$selected = in_array($term->term_id, $values) ? ' selected' : '';
			echo '<option value="'.$term->term_id.'"'.$selected.'>'.$term->name.'</option>';
		}

		echo '</select>';

		echo '</div>';

		return ob_get_clean();
	}

}

new ReactElements();
