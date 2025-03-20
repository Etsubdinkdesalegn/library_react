import { Route, Routes } from 'react-router-dom';
import BookForm from '../../book/BookForm';
import BorrowForm from '../../borrow/BorrowForm';
import BorrowerList from '../../borrow/BorrowerList';
import BookList from '../../book/BookList';
import UpdateBorrower from '../../borrow/UpdateBorrower';
import UserForm from './../../user/UserForm';
import UserList from './../../user/UserList';
import UpdateUser from './../../user/UpdateUser';
import UpdateBook from './../../book/UpdateBook';
import Header from '../../header/Header';


const AdminRoutes = () => {
  return (
    <>
      <Header/>
    <Routes>
        <Route path='/user' element={<UserForm/>}/>
        <Route path='/book' element={<BookForm/>}/>
        <Route path='/borrower' element={<BorrowForm/>}/>
        <Route path='/user_list' element={<UserList/>}/>
        <Route path='/book_list' element={<BookList/>}/>
        <Route path='/borrower_list' element={<BorrowerList/>}/>
        <Route path='/update_user/:user_id' element={<UpdateUser/>}/>
        <Route path='/update_book/:book_id' element={<UpdateBook/>}/>
        <Route path='/update_borrower/:borrower_id' element={<UpdateBorrower/>}/>
      <Route path='*' element={<div>Admin Page Not Found</div>} />
    </Routes>
      </>
  );
};

export default AdminRoutes;
