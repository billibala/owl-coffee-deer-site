<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Release_Notes extends CI_Controller {
	
	public function index() {
		$buildNum = intval($this->uri->segment(2, 0));
		if ($buildNum > 0) {
			$urlMap = array(
				65 => 71,
				66 => 72,
				69 => 75,
				70 => 76,
				71 => 77,
			);
			$hockeyID = $urlMap[$buildNum];
			if ( !empty($hockeyID) ) {
				$this->load->helper('url');
				redirect('https://rink.hockeyapp.net/apps/8c28d278358869f10ca55c5b4a1fa25c/app_versions/$hockeyID', 'location', 302);
			}
		}
	}
	
}