import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMedal } from '@fortawesome/free-solid-svg-icons';
import $ from 'jquery';
import '../../css/result.css';

const rank = ["1", "2", "3", "4", "5", "6"];
const rank_suffix = ["st", "nd", "rd", "th", "th", "th"];

const iconStyle = [ { 'color': 'gold' }, { 'color': 'blue' }, { 'color': 'chocolate' } ];

export default function Result(props) {
    /** 結果の内容 */
    const [result, setResult] = useState(null);

    // モーダルの表示の中心をbodyではなく.game-coreに変更
    $('#resultModalWindow').on('shown.bs.modal', function (e) {
        $('body').removeClass('modal-open');
        $('.game-core').addClass('modal-open');
    });
    $('#resultModalWindow').on('hidden.bs.modal', function (e) {
        $('.game-core').removeClass('modal-open');
        props.socket.emit('restart');
    });

    useEffect(() => {
        /** result画面の表示 */
        const show_result = (data) => {
            props.setMessage('結果発表ですわぁ(⌒,_ゝ⌒)');
            setResult(
                data.game.players.sort((a, b) => { // 降順ソート
                    if( a.score > b.score ) return -1;
                    if( a.score < b.score ) return 1;
                    return 0;
                }).map((player, index) => {
                    var id_result = 'eachResult' + index;
                    const icon = index < 4 ? <FontAwesomeIcon style={ iconStyle[index] }  icon={ faMedal }/> : null; 
                    return(
                        <tr className='eachResult' id={ id_result }>
                            <td className="eachResultIcon">{ icon }</td>
                            <td className="eachResultRank">{ rank[index] }</td>
                            <td className="eachResultRank">{ rank_suffix[index] }</td>
                            <td className="eachResultName">{ player.name }</td>
                            <td className="eachResutScore">{ player.score }</td>
                        </tr>
                    );
                })
            );
            $('#resultModalWindow').modal('toggle');
        }

        props.socket.on('result' ,(data) => show_result(data));
    }, [ props, result ]);

    const handleclick = () => {
        $('#resultModalWindow').modal('toggle');
    }

    return(
        <div className="modal fade" id="resultModalWindow" tabindex="-1" role="dialog" aria-labelledby="resultModalTitle" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" id="resultModalDialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="resultModalTitle">結果</h5>
                        <button type="button" class="close" onClick={ handleclick } aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <table id="result-table">
                            <tbody id="result">
                                <tr className='eachResult'>
                                    <td colspan="3">順位</td>
                                    <td>プレイヤー名</td>
                                    <td>スコア</td>
                                </tr>
                                { result }
                            </tbody>
                        </table>
                    </div>
                    <div className="modal-footer">
                        <button id="backButton" onClick={ handleclick } type="button" className="btn btn-warning m-auto">戻る</button>
                    </div>
                </div>
            </div>
        </div>
    );
}