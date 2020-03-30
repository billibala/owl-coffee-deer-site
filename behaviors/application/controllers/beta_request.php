<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Beta_Request extends CI_Controller {

	/**
	 * Index Page for this controller.
	 *
	 * Maps to the following URL
	 * 		http://example.com/index.php/welcome
	 *	- or -  
	 * 		http://example.com/index.php/welcome/index
	 *	- or -
	 * Since this controller is set as the default controller in 
	 * config/routes.php, it's displayed at http://example.com/
	 *
	 * So any other public methods not prefixed with an underscore will
	 * map to /index.php/welcome/<method_name>
	 * @see http://codeigniter.com/user_guide/general/urls.html
	 */
	public function index()
	{
	}
	public function sign_up() {
		$this->load->library('form_validation');
		$this->form_validation->set_rules('email', 'Email', 'trim|required|valid_email');
		if ($this->form_validation->run()) {
			$emailInBlackList = stristr($this->input->post('email'), 'vxtindia.com');
			if ( $emailInBlackList === false ) {
				$emailTpl = <<<FOOBAR
Thanks for joining Atttach beta testing program!

Atttach is in beta. We are still actively fixing bugs and adding features.

We hope you can stick with us during the beta period - try new builds, give us feedback, help us build the tool for you.

Please click "Show Invitation" to accept the invitation and download a copy of Atttach.

Bill
The Atttach Team
FOOBAR;
				$encEmailTpl = urlencode($emailTpl);
				$encEmail = urlencode($this->input->post('email'));
				$ch = curl_init("https://rink.hockeyapp.net/api/2/apps/8c28d278358869f10ca55c5b4a1fa25c/app_users");
				curl_setopt($ch, CURLOPT_HTTPHEADER, array('X-HockeyAppToken: d2f66ffedee1481198dc99587e62ce9d'));
				curl_setopt($ch, CURLOPT_POST, true);
				curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
				curl_setopt($ch, CURLOPT_POSTFIELDS, "email=$encEmail&role=3&tags=beta&message=$encEmailTpl");
				
				$httpResult = curl_exec($ch);
				curl_close($ch);
				if ( $httpResult === false ) $result = array('result' => 'failed');
				else {
					$hckyResult = json_decode($httpResult, true);
					if ( array_key_exists('errors', $hckyResult) ) {
						$result = array('result' => 'failed');
						// there's error
						foreach ( $hckyResult['errors'] as $theKey => $theValue ) {
							if ( $theKey == 'user_id' ) {
								$result['reason'] = 'taken';
								break;
							}
						}
					} else {
						$result = array('result' => 'done');
					}
				}
			} else {
				// the email in black list. log it.
				$result = array('result' => 'done');
				log_message('error', $this->input->post('email'));
			}
		} else {
			$result = array('result' => 'failed');
		}
		$this->output->set_content_type('application/json')->set_output(json_encode($result));
	}
}

/* End of file welcome.php */
/* Location: ./application/controllers/welcome.php */