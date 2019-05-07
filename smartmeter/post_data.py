def parse_keys(ch, des):
    _res_dict = {}
    _res_dict["channel"] = ch
    _res_dict["description"] = des
    return _res_dict
    
################# ITEMS TO PARSE #################
    
Plant_keys = {
    "channel": ["channel", int],
    "description": ["description", int],
}

##################################################
