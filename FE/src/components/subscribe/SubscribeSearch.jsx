import { TextField, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';
import search from '../../styles/subscribe/SubscribeSearch.module.css';

function SubscribeSearch() {
  const [nickname, setNickname] = useState('');
  return (
    <div className={search.wrapper}>
      <TextField
        id="outlined-basic"
        variant="outlined"
        placeholder="검색"
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 30,
            backgroundColor: '#f4f2f2',
            color: '#b9b9b9',
            height: '40px',
            '&.Mui-focused fieldset': {
              borderColor: 'rgba(29, 177, 119, 0.5)',
            },
          },
          '& input::placeholder': {
            textAlign: 'center',
            marginRight: '30px',
          },
        }}
        onChange={(e) => {
          setNickname(e.target.value);
        }}
        value={nickname}
        InputProps={{
          autoComplete: 'off',
          startAdornment: (
            <InputAdornment position="start">
              <IconButton onClick={() => undefined}>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </div>
  );
}

export default SubscribeSearch;
